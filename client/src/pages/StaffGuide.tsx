import Navbar from "@/components/Navbar";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  MessageSquare,
  Target,
  Heart,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Phone,
  Calendar,
  Star,
  Shield,
  Clock,
  DollarSign,
  Users,
  Lightbulb,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function CollapsibleSection({
  icon: Icon,
  title,
  subtitle,
  color,
  children,
  defaultOpen = false,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("rounded-2xl border overflow-hidden transition-all", open ? "border-border" : "border-border/40")}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 md:p-6 text-left hover:bg-accent/30 transition-colors"
      >
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">{children}</div>}
    </div>
  );
}

function ScriptBubble({ speaker, text, tip }: { speaker: "you" | "client"; text: string; tip?: string }) {
  return (
    <div className={cn("flex gap-3 mb-3", speaker === "you" ? "" : "flex-row-reverse")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          speaker === "you"
            ? "bg-primary/10 text-foreground rounded-bl-md"
            : "bg-muted text-foreground rounded-br-md"
        )}
      >
        <span className={cn("text-xs font-semibold block mb-1", speaker === "you" ? "text-primary" : "text-muted-foreground")}>
          {speaker === "you" ? "You (Staff/Provider)" : "Client"}
        </span>
        <p>{text}</p>
        {tip && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 italic flex items-start gap-1">
            <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
            {tip}
          </p>
        )}
      </div>
    </div>
  );
}

export default function StaffGuide() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-muted-foreground">Please log in to access the staff guide.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Staff Consultation Guide
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              How to Turn a Skin Analysis Into a Booking
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A simple, step-by-step conversation framework to help you discuss the AI skin report with clients and confidently close consultations.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
              <p className="text-2xl font-bold text-green-600">5 min</p>
              <p className="text-xs text-muted-foreground mt-1">Avg. conversation</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
              <p className="text-2xl font-bold text-blue-600">4 Steps</p>
              <p className="text-xs text-muted-foreground mt-1">Simple framework</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
              <p className="text-2xl font-bold text-purple-600">High</p>
              <p className="text-xs text-muted-foreground mt-1">Conversion rate</p>
            </div>
          </div>

          {/* Golden Rule */}
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Star className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-base mb-2">The Golden Rule</h3>
                <p className="text-sm leading-relaxed">
                  <strong>Never sell. Educate.</strong> The AI report does the heavy lifting — it shows the client exactly what's happening with their skin. Your job is to walk them through it like a caring expert, connect their concerns to solutions, and make booking feel like the obvious next step. When clients feel understood, they book themselves.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">

            {/* Step 1: Open with Warmth */}
            <CollapsibleSection
              icon={Heart}
              title="Step 1: Open with Warmth & Validation"
              subtitle="First 30 seconds — build trust immediately"
              color="bg-pink-500/10 text-pink-500"
              defaultOpen={true}
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Start by acknowledging their decision to get the analysis. This makes them feel smart for taking action. Then reference their specific concerns — this shows you actually read their intake and care about what THEY care about.
                </p>

                <div className="space-y-1">
                  <ScriptBubble
                    speaker="you"
                    text="Thank you so much for doing the skin analysis! I love that you're being proactive about your skin. I see you mentioned you're concerned about [their top concern, e.g., 'your jawline and some sagging']. Let's look at what the AI found together — I think you'll find it really eye-opening."
                    tip="Always start with their #1 concern. It shows you listened."
                  />
                </div>

                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Key phrases that build trust:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-5">
                    <li>"I love that you're being proactive..."</li>
                    <li>"That's a really common concern, you're not alone..."</li>
                    <li>"The great news is we have really effective options for this..."</li>
                    <li>"Let me show you exactly what's going on..."</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Never say:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-5">
                    <li>"Your skin is really bad" — say "there are some areas we can improve"</li>
                    <li>"You need this treatment" — say "this would be a great option for you"</li>
                    <li>"This is expensive but worth it" — never bring up cost first</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>

            {/* Step 2: Walk Through the Report */}
            <CollapsibleSection
              icon={Target}
              title="Step 2: Walk Through the Report Together"
              subtitle="2-3 minutes — educate, don't overwhelm"
              color="bg-blue-500/10 text-blue-500"
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Open the report on a screen or tablet. Walk through it section by section. Focus on their concerns first, then point out things the AI found that they might not have noticed. This is where the "aha moment" happens.
                </p>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <p className="text-sm font-semibold mb-3">The 3-Point Report Walkthrough:</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                      <div>
                        <p className="text-sm font-medium">The Score</p>
                        <p className="text-xs text-muted-foreground">"Your skin health score is [X]. This takes into account everything from texture to hydration to signs of aging. Think of it like a report card for your skin."</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                      <div>
                        <p className="text-sm font-medium">Their Top Concern</p>
                        <p className="text-xs text-muted-foreground">"So about the [jawline/wrinkles/etc.] you mentioned — the AI actually picked up on that too. It's showing [moderate/mild] [condition]. Here's what that means in plain English..."</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                      <div>
                        <p className="text-sm font-medium">The Surprise Finding</p>
                        <p className="text-xs text-muted-foreground">"One thing that's interesting — the AI also noticed [something they didn't mention, e.g., early sun damage or texture issues]. This is actually really common and easy to address."</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <ScriptBubble
                    speaker="you"
                    text="So your score is a 62 out of 100. That's actually pretty typical for someone in their 40s. The AI found some things that match exactly what you told us — the jawline area is showing some laxity, which is that 'softening' you've been noticing. It also picked up some texture changes and early volume loss in the mid-face area."
                  />
                  <ScriptBubble
                    speaker="client"
                    text="Oh wow, I didn't even notice the volume thing. What does that mean?"
                  />
                  <ScriptBubble
                    speaker="you"
                    text="Great question! So as we age, we naturally lose fat and collagen in certain areas — especially the cheeks and temples. It's subtle at first, but it's actually one of the main things that makes us look 'tired' even when we're not. The good news? This is one of the easiest things to address."
                    tip="The 'surprise finding' creates urgency without pressure. They asked YOU about it."
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Step 3: Bridge to Solutions */}
            <CollapsibleSection
              icon={Sparkles}
              title="Step 3: Bridge to Solutions (Not Sales)"
              subtitle="1-2 minutes — connect problems to treatments naturally"
              color="bg-purple-500/10 text-purple-500"
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Now transition from "what's wrong" to "what we can do." The report already has treatment recommendations — use them as your guide. Present 2-3 options max (not the full list). Frame everything as what THEY will experience, not what the treatment does.
                </p>

                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                  <p className="text-sm font-semibold mb-3">The "If/Then" Framework:</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Instead of listing treatments, connect each concern to a result:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">"If you want to address the</span>
                      <span className="font-medium text-foreground">[jawline]</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium text-purple-600">[Ultherapy]</span>
                      <span className="text-muted-foreground">would give you a natural lift"</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">"For the</span>
                      <span className="font-medium text-foreground">[volume loss]</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium text-purple-600">[fillers]</span>
                      <span className="text-muted-foreground">can restore that youthful fullness"</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">"For overall</span>
                      <span className="font-medium text-foreground">[skin quality]</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium text-purple-600">[a facial series]</span>
                      <span className="text-muted-foreground">would transform your texture"</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <ScriptBubble
                    speaker="you"
                    text="Based on what the AI found, I'd recommend we focus on two things. First, for the jawline — Ultherapy is amazing for this. It uses ultrasound energy to tighten and lift, and you'll see results over 2-3 months as your body builds new collagen. Second, for the volume — a little filler in the cheeks can make a huge difference. It's subtle but people will tell you that you look 'refreshed.'"
                  />
                  <ScriptBubble
                    speaker="client"
                    text="How much does that cost?"
                  />
                  <ScriptBubble
                    speaker="you"
                    text="Great question. Let me pull up the pricing for you — the report actually has the exact costs. [Show the treatment section with prices.] We also have package options that save you money if you want to do both. Would you like me to walk you through those?"
                    tip="When they ask about price, they're already interested. This is a buying signal!"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" /> Power phrases for bridging:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-5">
                    <li>"The nice thing about this is..." (makes treatment feel easy)</li>
                    <li>"Most of my clients who had similar concerns..." (social proof)</li>
                    <li>"You'll start noticing..." (paints a picture of results)</li>
                    <li>"The best part is there's minimal downtime..." (removes fear)</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>

            {/* Step 4: Close with Confidence */}
            <CollapsibleSection
              icon={Calendar}
              title="Step 4: Close — Make Booking the Obvious Next Step"
              subtitle="30 seconds — the assumptive close"
              color="bg-green-500/10 text-green-500"
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Don't ask "Would you like to book?" — that invites "no." Instead, use an <strong>assumptive close</strong>: assume they want to move forward and ask about timing. If they hesitate, offer a smaller first step.
                </p>

                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                  <p className="text-sm font-semibold mb-3">3 Closing Scripts (pick the one that fits):</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-green-600 mb-1">The Assumptive Close (Best for warm leads)</p>
                      <p className="text-sm italic text-muted-foreground">"Let's get you on the schedule! I have availability [this week/next week]. Would [Tuesday or Thursday] work better for you?"</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-blue-600 mb-1">The Consultation Close (For hesitant clients)</p>
                      <p className="text-sm italic text-muted-foreground">"Why don't we start with a quick in-person consultation? It's complimentary, and I can show you exactly what we'd do and answer any questions. Does that sound good?"</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-purple-600 mb-1">The Facial First Close (For price-sensitive clients)</p>
                      <p className="text-sm italic text-muted-foreground">"A great first step would be one of our signature facials — it'll address the texture and give you a taste of what professional treatments can do. Plus it's a great way to see how your skin responds. Want me to book that?"</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <ScriptBubble
                    speaker="you"
                    text="I'm really excited about what we can do for you. Let's get you on the schedule — I have some openings next week. Would Tuesday afternoon or Thursday morning work better?"
                  />
                  <ScriptBubble
                    speaker="client"
                    text="I think I need to think about it..."
                  />
                  <ScriptBubble
                    speaker="you"
                    text="Absolutely, take your time! In the meantime, I'll email you the full report so you can review it. And if you'd like, we can start with a complimentary consultation — no commitment, just a chance to see the space and ask any questions. Would that be helpful?"
                    tip="Never pressure. Offer a smaller step. Most 'think about it' clients book within 48 hours if you follow up."
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Handling Objections */}
            <CollapsibleSection
              icon={Shield}
              title="Handling Common Objections"
              subtitle="What to say when clients push back"
              color="bg-orange-500/10 text-orange-500"
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-card border border-border/60">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      <p className="text-sm font-semibold">"It's too expensive"</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "I totally understand — it's an investment. Here's what I'd suggest: let's start with [the most impactful single treatment] and see how you love the results. Many of my clients start with one treatment and then decide to add more over time. We also have package pricing that makes it more affordable if you want to do a series."
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border/60">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <p className="text-sm font-semibold">"I don't have time"</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "I hear you — everyone's busy! The good news is most of these treatments take less than an hour, and there's little to no downtime. You could literally come in on your lunch break. What day of the week is usually least hectic for you?"
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border/60">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <p className="text-sm font-semibold">"I'm scared it'll hurt / look unnatural"</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "That's a really common concern, and I'm glad you brought it up. We use numbing cream and the latest techniques to keep you comfortable. And as for looking natural — that's our specialty. The goal is for people to say 'you look amazing' not 'what did you get done.' I can show you some before-and-afters of clients with similar concerns if you'd like."
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border/60">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      <p className="text-sm font-semibold">"I need to ask my partner"</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "Of course! I'll send you the full report with all the details and pricing so you can share it. A lot of our clients find that once their partner sees the science behind the recommendations, they're totally on board. Feel free to call or text me if either of you have questions!"
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Follow-Up */}
            <CollapsibleSection
              icon={Phone}
              title="The Follow-Up (Don't Skip This!)"
              subtitle="48-hour follow-up doubles your booking rate"
              color="bg-teal-500/10 text-teal-500"
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If they didn't book on the spot, follow up within 48 hours. The analysis report is your secret weapon — reference specific findings to reignite their interest.
                </p>

                <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/10">
                  <p className="text-sm font-semibold mb-3">Follow-Up Templates:</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-teal-600 mb-1">Text/SMS (24 hours later)</p>
                      <p className="text-sm italic text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        "Hi [Name]! It was great chatting about your skin analysis yesterday. I was thinking about your [jawline concern] and wanted to let you know we just had a cancellation on [day]. Would you like me to hold that spot for you? No pressure at all! 😊"
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-teal-600 mb-1">Email (48 hours later)</p>
                      <p className="text-sm italic text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        "Hi [Name], I hope you've had a chance to review your skin analysis report! I wanted to follow up and see if you had any questions. I know [their concern] was really important to you, and I'd love to help you get started on addressing it. We have some great availability this week if you'd like to come in. Let me know!"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" /> Follow-up stats:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-5">
                    <li>80% of sales happen after the 5th follow-up</li>
                    <li>Most competitors give up after 1 follow-up</li>
                    <li>A friendly text within 24 hours has the highest response rate</li>
                    <li>Reference their specific concern — it shows you remember them</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>

            {/* Quick Reference */}
            <CollapsibleSection
              icon={MessageSquare}
              title="Quick Reference: Condition → Layman's Explanation"
              subtitle="How to explain clinical terms in simple language"
              color="bg-indigo-500/10 text-indigo-500"
            >
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  When the report uses clinical terms, translate them for the client:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60">
                        <th className="text-left py-2 pr-4 font-semibold">Report Says</th>
                        <th className="text-left py-2 font-semibold">You Say</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      <tr><td className="py-2 pr-4 text-muted-foreground">Jowling / Jawline Laxity</td><td className="py-2">"The skin along your jawline is starting to soften and lose its definition"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Volume Loss / Hollowing</td><td className="py-2">"You're losing some of the natural fullness in your face — that's what can make us look tired"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Nasolabial Folds</td><td className="py-2">"Those lines that run from your nose down to the corners of your mouth"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Periorbital Hyperpigmentation</td><td className="py-2">"Dark circles under your eyes"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Rhytides</td><td className="py-2">"Fine lines and wrinkles"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Telangiectasia</td><td className="py-2">"Tiny visible blood vessels — those little red lines you might see"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Hyperpigmentation</td><td className="py-2">"Dark spots or uneven skin tone — usually from sun exposure"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Skin Laxity</td><td className="py-2">"Your skin isn't bouncing back the way it used to — it's lost some of its firmness"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Comedones</td><td className="py-2">"Clogged pores — blackheads and whiteheads"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Erythema</td><td className="py-2">"Redness or irritation in the skin"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Fitzpatrick Type</td><td className="py-2">"Your skin type based on how it reacts to sun — this helps us choose the safest treatments"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Marionette Lines</td><td className="py-2">"Those lines that go from the corners of your mouth downward"</td></tr>
                      <tr><td className="py-2 pr-4 text-muted-foreground">Submental Fullness</td><td className="py-2">"Extra fullness under the chin — sometimes called a double chin"</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CollapsibleSection>

          </div>

          {/* Bottom CTA */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Remember</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              The AI report is your credibility tool. It removes the "salesy" feeling because the technology identified the concerns — not you. You're just the caring expert who helps them understand it and take action. Be genuine, be warm, and the bookings will follow.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
