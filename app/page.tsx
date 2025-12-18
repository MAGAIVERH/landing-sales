import { AiChatWidget } from './marketing/components/ai-chat-widget/ai-chat-widget';
import { CtaBand } from './marketing/components/cta-band/cta-band';
import { FAQ } from './marketing/components/faq/faq';
import { Footer } from './marketing/components/footer/footer';
import { Header } from './marketing/components/header/header';
import { Hero } from './marketing/components/hero/hero';
import { HowItWorks } from './marketing/components/how-It-Works/how-it-works';
import { Pricing } from './marketing/components/pricing/pricing';
import { Showcase } from './marketing/components/showcase/showcase';
import { SocialProof } from './marketing/components/social-proof/social-proof';
import { SolutionsTabs } from './marketing/components/solutions-tabs/solutions-tabs';
import { Starts } from './marketing/components/starts/starts';
import { Testimonials } from './marketing/components/testimonials/testimonials';

export default function Page() {
  return (
    <>
      <Header />
      <Hero />
      <SocialProof />
      <Starts />
      <SolutionsTabs />
      <HowItWorks />
      <Pricing />
      <Showcase />
      <Testimonials />
      <FAQ />
      <CtaBand />
      <Footer />
      <AiChatWidget />
    </>
  );
}
