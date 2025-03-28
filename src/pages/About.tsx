import React from "react";
import Hero from "../components/ui-components/Hero";
import {
  UserCircle2,
  Award,
  Clock,
  PenTool,
  Users,
  History,
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <PenTool size={32} className="text-ornate-gold" />,
      title: "Creativity",
      description:
        "We approach each project with fresh eyes, developing innovative solutions that push boundaries while remaining functional and timeless.",
    },
    {
      icon: <Award size={32} className="text-ornate-gold" />,
      title: "Excellence",
      description:
        "We hold ourselves to the highest standards in every aspect of our work, from design concepts to material selection and installation.",
    },
    {
      icon: <Users size={32} className="text-ornate-gold" />,
      title: "Collaboration",
      description:
        "We believe in the power of partnership with our clients, fostering open communication and respect throughout the design process.",
    },
    {
      icon: <Clock size={32} className="text-ornate-gold" />,
      title: "Reliability",
      description:
        "We honor deadlines, maintain transparent communication, and consistently deliver on our promises to our clients.",
    },
  ];

  return (
    <div>
      <Hero
        title="Our Story"
        subtitle="About Us"
        description="Founded with a passion for creating beautiful, functional spaces that reflect the unique identities of our clients."
        backgroundImage="https://img.freepik.com/free-photo/armchair-green-living-room-with-copy-space_43614-910.jpg"
        overlay={true}
      />

      {/* Our Journey Section */}
      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="ornate-subtitle mb-4">Our Journey</h2>
              <h3 className="ornate-title mb-6">From Vision to Reality</h3>

              <p className="text-ornate-charcoal/80 mb-6 leading-relaxed">
                Ornate Interior Decor was founded in 2010 by a team of
                passionate designers who shared a vision: to create spaces that
                are not only beautiful but also deeply personal and functional.
                What began as a small design studio has grown into a
                full-service interior design firm with a portfolio of
                residential and commercial projects across the country.
              </p>

              <p className="text-ornate-charcoal/80 mb-6 leading-relaxed">
                Over the years, we've built a reputation for thoughtful design,
                meticulous attention to detail, and an unwavering commitment to
                client satisfaction. Our team has expanded to include talented
                designers, project managers, and skilled craftspeople, each
                bringing unique expertise and perspective to our projects.
              </p>

              <p className="text-ornate-charcoal/80 leading-relaxed">
                Today, we continue to be driven by our founding principles:
                creating spaces that inspire, nurturing relationships with our
                clients, and pursuing excellence in every aspect of our work.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First Image (Top Left) */}
              <div className="relative overflow-hidden col-span-1 row-span-1 animate-fade-in aspect-[4/3]">
                <div className="relative w-full h-full overflow-hidden rounded-sm group">
                  <img
                    src="https://images.unsplash.com/photo-1616137303871-05ce745f9cdb?q=80&w=600&auto=format&fit=crop"
                    alt="Team at work"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-700" />
                </div>
              </div>

              {/* Second Image (Right Column - Full Height) */}
              <div
                className="relative overflow-hidden col-span-1 row-span-2 animate-fade-in aspect-[3/4] sm:aspect-auto"
                style={{ animationDelay: "150ms" }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm group">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop"
                    alt="Design process"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-700" />
                </div>
              </div>

              {/* Third Image (Bottom Left) */}
              <div
                className="relative overflow-hidden col-span-1 row-span-1 animate-fade-in aspect-[4/3]"
                style={{ animationDelay: "300ms" }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm group">
                  <img
                    src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=600&auto=format&fit=crop"
                    alt="Completed project"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-ornate-cream">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="ornate-subtitle mb-4 animate-fade-in">
              Meet Our Team
            </h2>
            <h3 className="ornate-title mb-6 animate-fade-in">
              The Faces Behind Our Designs
            </h3>
            <p className="text-ornate-charcoal/80 leading-relaxed animate-fade-in">
              Our talented team brings together diverse skills, experiences, and
              perspectives, united by a shared passion for exceptional design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="bg-white p-6 text-center group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-48 h-48 mx-auto mb-6 overflow-hidden rounded-full">
                  <UserCircle2 size={192} className="text-gray-200" />
                </div>
                <h4 className="font-serif text-xl mb-1 text-ornate-charcoal">
                  Team Member Name
                </h4>
                <p className="text-ornate-gold mb-4">Position / Role</p>
                <p className="text-ornate-charcoal/70 text-sm">
                  Brief description about the team member, their experience,
                  specialties, and approach to design.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="ornate-subtitle mb-4 animate-fade-in">Our Values</h2>
            <h3 className="ornate-title mb-6 animate-fade-in">
              What Guides Our Work
            </h3>
            <p className="text-ornate-charcoal/80 leading-relaxed animate-fade-in">
              These core principles shape our approach to design and our
              relationships with clients, partners, and each other.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 border border-ornate-gold/10 hover:border-ornate-gold/30 transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                  {value.icon}
                </div>
                <h4 className="font-serif text-xl mb-3 text-ornate-charcoal">
                  {value.title}
                </h4>
                <p className="text-ornate-charcoal/70 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-ornate-offwhite">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="ornate-subtitle mb-4 animate-fade-in">
              Our History
            </h2>
            <h3 className="ornate-title mb-6 animate-fade-in">
              Milestones Along The Way
            </h3>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-ornate-gold/30"></div>

            {/* Timeline Items */}
            {[
              {
                year: "2010",
                title: "Our Beginning",
                description:
                  "Ornate Interior Decor was founded with a vision to create beautiful, functional spaces.",
              },
              {
                year: "2013",
                title: "First Major Project",
                description:
                  "Completed our first large-scale commercial project, a boutique hotel that garnered industry recognition.",
              },
              {
                year: "2015",
                title: "Team Expansion",
                description:
                  "Grew our team to include specialized designers, project managers, and support staff.",
              },
              {
                year: "2018",
                title: "Design Award",
                description:
                  "Received our first major design award for a innovative residential project.",
              },
              {
                year: "2020",
                title: "New Headquarters",
                description:
                  "Moved into our new design studio, featuring a materials library and client meeting spaces.",
              },
              {
                year: "Today",
                title: "Looking Forward",
                description:
                  "Continuing to grow, innovate, and create exceptional designs for our valued clients.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative z-10 flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                } animate-fade-in`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`w-1/2 ${
                    index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"
                  }`}
                >
                  <span className="ornate-subtitle block mb-1">
                    {item.year}
                  </span>
                  <h4 className="font-serif text-xl mb-2 text-ornate-charcoal">
                    {item.title}
                  </h4>
                  <p className="text-ornate-charcoal/70">{item.description}</p>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-ornate-gold rounded-full"></div>

                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
