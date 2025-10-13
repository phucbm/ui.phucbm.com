import SlideCarousel from "./components/slide-carousel";

export default async function Page() {
  return (
    <SlideCarousel
      baseSpeed={0.5}
      hoverSlowdownRatio={0.5}
      autoSlide={true}
      infinite={true}
      manualNav={false}
    />
  );
}
