import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.instagram.com/naturalssalon/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) throw new Error('Failed to fetch Instagram');

    const html = await response.text();
    
    // Pattern 1: OG Description (standard)
    const ogDescMatch = html.match(/property="og:description"\s+content="([^"]+)"/) || 
                        html.match(/content="([^"]+)"\s+property="og:description"/);
    
    if (ogDescMatch && ogDescMatch[1]) {
      const desc = ogDescMatch[1];
      const followersMatch = desc.match(/([\d.,]+[KMB]?)\s+Followers/i);
      const followingMatch = desc.match(/([\d.,]+[KMB]?)\s+Following/i);
      const postsMatch = desc.match(/([\d.,]+[KMB]?)\s+Posts/i);

      if (followersMatch || postsMatch) {
        return NextResponse.json({
          success: true,
          followers: followersMatch ? followersMatch[1] : '68.8K',
          following: followingMatch ? followingMatch[1] : '303',
          posts: postsMatch ? postsMatch[1] : '3,479',
          lastUpdated: new Date().toISOString()
        });
      }
    }

    // Pattern 2: Script data fallback
    const sharedDataMatch = html.match(/_sharedData\s*=\s*({.+?});/);
    if (sharedDataMatch) {
      try {
        const data = JSON.parse(sharedDataMatch[1]);
        const user = data.entry_data?.ProfilePage?.[0]?.graphql?.user;
        if (user) {
          return NextResponse.json({
            success: true,
            followers: user.edge_followed_by?.count?.toLocaleString() || '68.8K',
            posts: user.edge_owner_to_timeline_media?.count?.toLocaleString() || '3,479',
            lastUpdated: new Date().toISOString()
          });
        }
      } catch (e) {}
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Parsing logic missed, using last known verified data',
      followers: '68.8K',
      posts: '3,479',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Instagram Fetch Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to Instagram',
      followers: '68.8K',
      posts: '3,479'
    }, { status: 500 });
  }
}
