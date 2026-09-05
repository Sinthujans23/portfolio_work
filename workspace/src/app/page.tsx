import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <section id="home" className="w-full">
        <Hero />
      </section>
      <section id="about" className="w-full">
        <About />
      </section>
      <section id="skills" className="w-full">
        <Skills />
      </section>
      <section id="projects" className="w-full">
        <Projects />
      </section>
      <section id="contact" className="w-full">
        <ContactForm />
      </section>
      <Footer />
    </main>
  );
}
