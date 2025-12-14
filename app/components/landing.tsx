import { AiChatWidget } from './ai-chat-widget';
import { CtaBand } from './cta-band';
import { FAQ } from './faq';
import { Footer } from './footer';
import { Header } from './header';
import { Hero } from './hero';
import { HowItWorks } from './how-it-works';
import { Pricing } from './pricing';
import { Showcase } from './showcase';
import { SolutionsTabs } from './solutions-tabs';
import { Stats } from './stats';
import { Testimonials } from './testimonials';

export const Landing = () => {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Header />
      <Hero />
      <Stats />
      <SolutionsTabs />
      <HowItWorks />
      <Showcase />
      <Testimonials />
      <FAQ />
      <CtaBand />
      <Footer />
      <AiChatWidget />
    </div>
  );
};
