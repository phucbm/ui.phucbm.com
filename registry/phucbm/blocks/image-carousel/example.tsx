import {ImageCarousel} from "@/registry/phucbm/blocks/image-carousel/image-carousel";

export default function Example() {
    const exampleImages = () => Array.from({length: 10}, (_, i) => ({
        url: `https://picsum.photos/400/400?random=${Math.random()}`,
        title: `Image ${i + 1}`
    }));
    const exampleLogoImages = () => {
        const brands = ['apple', 'google', 'microsoft', 'meta', 'netflix', 'spotify', 'samsung', 'intel', 'adobe'];
        const shuffled = brands.sort(() => Math.random() - 0.5);
        return shuffled.map((brand, i) => ({
            url: `https://cdn.svglogos.dev/logos/${brand}.svg`,
            title: brand.charAt(0).toUpperCase() + brand.slice(1)
        }));
    };

    return (
        <>
            <div className="mt-[50px]">
                <ImageCarousel images={exampleImages()}/>
            </div>

            <div className="mt-[50px]">
                No drag
                <ImageCarousel
                    itemClass="bg-transparent mr-8"
                    imageClass="object-contain"
                    direction={1}
                    drag={false}
                    images={exampleLogoImages()}/>
            </div>

            <div className="mt-[50px]">
                No hover
                <ImageCarousel
                    hover={false}
                    images={exampleImages()}/>
            </div>
        </>
    );
}