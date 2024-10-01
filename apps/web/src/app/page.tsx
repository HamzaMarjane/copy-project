"use client";
import dynamic from "next/dynamic";
import { Layout } from "antd";
import CustomLayout from "@ntla9aw/ui/src/components/molecules/CustomLayout";

const Hero = dynamic(
  () => import("@ntla9aw/ui/src/components/organisms/Hero"),
  { ssr: false },
);
const SectionOne = dynamic(
  () => import("@ntla9aw/ui/src/components/organisms/SectionOne"),
  { ssr: false },
);
const SectionTwo = dynamic(
  () => import("@ntla9aw/ui/src/components/organisms/SectionTwo"),
  { ssr: false },
);
const SectionThree = dynamic(
  () => import("@ntla9aw/ui/src/components/organisms/SectionThree"),
  { ssr: false },
);
const SectionFour = dynamic(
  () => import("@ntla9aw/ui/src/components/organisms/SectionFour"),
  { ssr: false },
);
const SectionFive = dynamic(
  () => import("@ntla9aw/ui/src/components/organisms/SectionFive"),
  { ssr: false },
);

import AnimationOne from "./assets/Animation - 1726484377933.json";
import AnimationTwo from "./assets/Animation - 1726489698576.json";
import AnimationThree from "./assets/Animation - 1726489941845.json";
import LogoOne from "./assets/stars-svgrepo-com.svg"; // Adjust the path accordingly
import LogoTwo from "./assets/wind-svgrepo-com.svg"; // Adjust the path accordingly
import LogoThree from "./assets/smiley-wink-bold-svgrepo-com.svg"; // Adjust the path accordingly
import TestimonialOne from "./assets/testimonial1.svg";
import TestimonialTwo from "./assets/testimonial2.svg";
import TestimonialThree from "./assets/testimonial3.svg";

const testimonials = [
  {
    vector: <TestimonialOne width={286} height={184} fill="#5AB2FF" />,
    quotation: "This platform has changed my life for the better!",
  },
  {
    vector: <TestimonialTwo width={286} height={184} fill="#5AB2FF" />,
    quotation: "I love connecting with new people through events!",
  },
  {
    vector: <TestimonialThree width={286} height={184} fill="#5AB2FF" />,
    quotation: "A fantastic experience overall!",
  },
];
const subscriptions = [
  {
    name: "Free",
    price: "$0/month",
    terms: [
      { id: 1, description: "Book events" },
      { id: 2, description: "Join communities" },
      { id: 3, description: "Access to basic features" },
      { id: 4, description: "Limited event attendance" },
    ],
  },
  {
    name: "Individual",
    price: "$9.99/month",
    terms: [
      { id: 1, description: "Create and manage events" },
      { id: 2, description: "Join unlimited communities" },
      { id: 3, description: "Priority event booking" },
      { id: 4, description: "Access to premium features" },
    ],
  },
  {
    name: "Organization",
    price: "$49.99/month",
    terms: [
      { id: 1, description: "Create and manage multiple events" },
      { id: 2, description: "Create and manage communities" },
      { id: 3, description: "Advanced analytics and reporting" },
      { id: 4, description: "Dedicated support" },
    ],
  },
];

<SectionFive subscriptions={subscriptions} />

export default function Home() {
  return (
    <CustomLayout>
      <Layout style={{ padding: "8em" }}>
        <Hero
          imageUrl="https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          title="Find Your Community and grow you network"
          subtitle="get connected with our exponentially growing user base and our fresh and woinderful experience."
          buttonLabel="Start Now"
          onButtonClick={() => {}}
        />
        <SectionOne
          animationData={AnimationOne}
          vector={<LogoOne width={200} height={200} fill="#5AB2FF" />}
          title="Ntla9aw Is more than an Event Planner"
          subtitle="ntla9aw is a platform for connecting people with offline or online events"
        />
        <SectionTwo
          animationData={AnimationTwo}
          vector={<LogoTwo width={200} height={200} fill="#5AB2FF" />}
          title="Our Best Solution for Branding and Networking"
          subtitle="ntla9aw offers solution for people seeking growth significant connections and network."
        />
        <SectionThree
          animationData={AnimationThree}
          vector={<LogoThree width={100} height={100} fill="#5AB2FF" />}
          title="You probably seen enough..."
          subtitle="Now We’d like to know about you"
        />
        <SectionFour testimonials={testimonials} />
        <SectionFive subscriptions={subscriptions} />
      </Layout>
    </CustomLayout>
  );
}
