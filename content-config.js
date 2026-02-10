/* ===================================
   WINSTON-SALEM BARREL LEAGUE
   Content Configuration
   
   Edit this file to update text, event details, and other content
   throughout the website without touching HTML
   =================================== */

const siteContent = {
    // Site Metadata
    siteName: "Winston-Salem Barrel League",
    tagline: "Where tradition meets community, one pour at a time",
    contactEmail: "info@wsblbourbonleague.com",
    establishedYear: "2026",
    
    // Hero Section
    hero: {
        title: "Winston-Salem Barrel League",
        subtitle: "Where tradition meets community, one pour at a time",
        ctaText: "Become a Member"
    },
    
    // Welcome Section
    welcome: {
        heading: "Welcome to the League",
        leadText: "The Winston-Salem Barrel League is more than a club—it's a gathering place for those who appreciate the art, history, and craft of exceptional spirits. Whether you're taking your first sip or you've been collecting for years, you'll find your place among us.",
        bodyText: "We meet monthly to share exceptional bourbon, whiskey, and other fine spirits, forge lasting friendships, and explore the rich traditions of barrel-aged craft. From intimate tastings in Winston-Salem to unforgettable distillery excursions across Kentucky and beyond, every gathering is an opportunity to deepen your knowledge and expand your palate."
    },
    
    // Upcoming Event (Update this monthly)
    upcomingEvent: {
        badge: "Next Event",
        title: "Monthly Tasting: The Art of Single Barrel",
        date: "March 15, 2026",
        time: "7:00 PM",
        description: "Join us for an exploration of single barrel selections from four distinguished distilleries. We'll discuss what makes each barrel unique and how master distillers select the finest casks for bottling.",
        ctaText: "View Full Calendar"
    },
    
    // What We Offer
    offerings: [
        {
            icon: "🥃",
            title: "Monthly Tastings",
            description: "Expertly curated tastings featuring bourbon, whiskey, and other fine spirits—both classic expressions and rare finds. Each event includes guided notes and thoughtful discussion."
        },
        {
            icon: "🚌",
            title: "Distillery Trips",
            description: "Experience bourbon at its source with organized trips to renowned distilleries throughout Kentucky and the Southeast."
        },
        {
            icon: "assets/icons/barrel.png",
            title: "Barrel Picks",
            description: "Members gain exclusive access to our private barrel selections—unique bottlings you won't find anywhere else."
        },
        {
            icon: "👥",
            title: "Community",
            description: "Connect with fellow enthusiasts through our members-only forum and build friendships that extend beyond bourbon."
        }
    ],
    
    // Latest Barrel Pick
    latestBarrelPick: {
        label: "Latest Barrel Pick",
        title: "WSBL Single Barrel Rye",
        description: "Our first club selection: a 6-year cask strength rye finished in port wine barrels. Notes of dark cherry, baking spices, and toasted oak with a long, warming finish.",
        status: "Members Only | Limited Availability",
        ctaText: "Explore Our Selections",
        // To add an image, update this path:
        imagePath: "" // e.g., "images/barrel-pick-1.jpg"
    },
    
    // CTA Section
    finalCTA: {
        heading: "Ready to Join?",
        text: "Become part of Winston-Salem's premier spirits community. All experience levels welcome.",
        buttonText: "Apply for Membership"
    },
    
    // Social Media Links
    socialMedia: {
        instagram: "#", // Update with your Instagram URL
        facebook: "#"  // Update with your Facebook URL
    }
};

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteContent;
}
