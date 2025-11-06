import {InfiniteImageCarousel} from "@/registry/phucbm/blocks/infinite-image-carousel/infinite-image-carousel";

export default function Example() {
    return (
        <div className="h-screen flex flex-col justify-around py-[10vh]">
            {/*logos*/}
            <InfiniteImageCarousel
                itemClass="lg:mr-8 lg:px-4 px-2 xl:[--width:12vw] lg:[--width:150px] [--width:100px]"
                isLogo={true}
                direction={1}
                images={exampleLogos()}
            />

            {/*photos*/}
            <InfiniteImageCarousel images={examplePhotos()}/>
        </div>
    );
}

const examplePhotos = () => Array.from({length: 10}, (_, i) => ({
    url: `https://picsum.photos/400/400?random=${Math.random()}`,
    title: `Image ${i + 1}`
}));
const exampleLogos = () => {
    const brands = ['apple', 'google', 'microsoft', 'meta', 'netflix', 'spotify', 'samsung', 'intel', 'adobe'];
    const shuffled = brands.sort(() => Math.random() - 0.5);
    return shuffled.map((brand, i) => ({
        url: `https://cdn.svglogos.dev/logos/${brand}.svg`,
        title: brand.charAt(0).toUpperCase() + brand.slice(1)
    }));
};