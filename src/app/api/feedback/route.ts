import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET: Fetch aggregated feedback analytics
export async function GET() {
  try {
    // Fetch all feedback with customer and service info
    const { data: feedbacks, error } = await supabaseAdmin
      .from("customer_feedback")
      .select(`
        id,
        customer_id,
        appointment_id,
        rating,
        service_quality,
        stylist_behaviour,
        cleanliness,
        value_for_money,
        comment,
        sentiment_label,
        source,
        branch_location,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Feedback fetch error:", error);
      // If table doesn't exist yet, return empty data gracefully
      return NextResponse.json({
        sentimentVelocity: 0,
        avgRating: 0,
        totalFeedbacks: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
        avgServiceQuality: 0,
        avgStylistBehaviour: 0,
        avgCleanliness: 0,
        avgValueForMoney: 0,
        recentFeedbacks: [],
        trend: "stable",
        _notice: "Table may not exist yet. Run supabase_feedback_table.sql to set up.",
      });
    }

    const allFeedbacks = feedbacks || [];

    // Calculate aggregated metrics
    const totalFeedbacks = allFeedbacks.length;

    if (totalFeedbacks === 0) {
      return NextResponse.json({
        sentimentVelocity: 0,
        avgRating: 0,
        totalFeedbacks: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
        avgServiceQuality: 0,
        avgStylistBehaviour: 0,
        avgCleanliness: 0,
        avgValueForMoney: 0,
        recentFeedbacks: [],
        trend: "stable",
      });
    }

    // Average rating
    const avgRating =
      allFeedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / totalFeedbacks;

    // Sub-category averages
    const avgServiceQuality =
      allFeedbacks.reduce((acc, f) => acc + (f.service_quality || 0), 0) / totalFeedbacks;
    const avgStylistBehaviour =
      allFeedbacks.reduce((acc, f) => acc + (f.stylist_behaviour || 0), 0) / totalFeedbacks;
    const avgCleanliness =
      allFeedbacks.reduce((acc, f) => acc + (f.cleanliness || 0), 0) / totalFeedbacks;
    const avgValueForMoney =
      allFeedbacks.reduce((acc, f) => acc + (f.value_for_money || 0), 0) / totalFeedbacks;

    // Rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allFeedbacks.forEach((f) => {
      const r = Math.round(f.rating || 0) as 1 | 2 | 3 | 4 | 5;
      if (r >= 1 && r <= 5) ratingDistribution[r]++;
    });

    // Sentiment breakdown
    const sentimentBreakdown = { positive: 0, neutral: 0, negative: 0 };
    allFeedbacks.forEach((f) => {
      if (f.sentiment_label === "positive") sentimentBreakdown.positive++;
      else if (f.sentiment_label === "negative") sentimentBreakdown.negative++;
      else sentimentBreakdown.neutral++;
    });

    // Sentiment Velocity = weighted score out of 100
    // Formula: ((avgRating / 5) * 60) + ((positiveRatio) * 25) + ((avgSubScores / 5) * 15)
    const positiveRatio = sentimentBreakdown.positive / totalFeedbacks;
    const avgSubScores =
      (avgServiceQuality + avgStylistBehaviour + avgCleanliness + avgValueForMoney) / 4;
    const sentimentVelocity =
      (avgRating / 5) * 60 + positiveRatio * 25 + (avgSubScores / 5) * 15;

    // Trend: compare last 7 days vs previous 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentWeek = allFeedbacks.filter(
      (f) => new Date(f.created_at) >= sevenDaysAgo
    );
    const previousWeek = allFeedbacks.filter(
      (f) =>
        new Date(f.created_at) >= fourteenDaysAgo &&
        new Date(f.created_at) < sevenDaysAgo
    );

    const recentAvg =
      recentWeek.length > 0
        ? recentWeek.reduce((acc, f) => acc + (f.rating || 0), 0) / recentWeek.length
        : avgRating;
    const previousAvg =
      previousWeek.length > 0
        ? previousWeek.reduce((acc, f) => acc + (f.rating || 0), 0) / previousWeek.length
        : avgRating;

    const trend = recentAvg > previousAvg ? "up" : recentAvg < previousAvg ? "down" : "stable";

    return NextResponse.json({
      sentimentVelocity: Math.round(sentimentVelocity * 10) / 10,
      avgRating: Math.round(avgRating * 10) / 10,
      totalFeedbacks,
      ratingDistribution,
      sentimentBreakdown,
      avgServiceQuality: Math.round(avgServiceQuality * 10) / 10,
      avgStylistBehaviour: Math.round(avgStylistBehaviour * 10) / 10,
      avgCleanliness: Math.round(avgCleanliness * 10) / 10,
      avgValueForMoney: Math.round(avgValueForMoney * 10) / 10,
      recentFeedbacks: allFeedbacks.slice(0, 10),
      trend,
    });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Submit new feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customer_id,
      appointment_id,
      rating,
      service_quality,
      stylist_behaviour,
      cleanliness,
      value_for_money,
      comment,
      source,
      branch_location,
    } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Simple sentiment classification based on rating + sub-scores
    const avgScore =
      ((rating || 0) +
        (service_quality || rating) +
        (stylist_behaviour || rating) +
        (cleanliness || rating) +
        (value_for_money || rating)) /
      5;
    const sentiment_label =
      avgScore >= 4 ? "positive" : avgScore >= 2.5 ? "neutral" : "negative";

    const { data, error } = await supabaseAdmin
      .from("customer_feedback")
      .insert({
        customer_id: customer_id || null,
        appointment_id: appointment_id || null,
        rating,
        service_quality: service_quality || rating,
        stylist_behaviour: stylist_behaviour || rating,
        cleanliness: cleanliness || rating,
        value_for_money: value_for_money || rating,
        comment: comment || null,
        sentiment_label,
        source: source || "in-app",
        branch_location: branch_location || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Feedback insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, feedback: data }, { status: 201 });
  } catch (err) {
    console.error("Feedback POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
