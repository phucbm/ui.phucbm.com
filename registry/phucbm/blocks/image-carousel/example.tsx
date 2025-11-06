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
                Logo
                <ImageCarousel
                    itemClass="lg:mr-8 lg:px-4 px-2"
                    isLogo={true}
                    direction={1}
                    images={exampleLogoImages()}/>
            </div>

            <div className="mt-[50px]">
                No hover, No drag
                <ImageCarousel
                    hover={false}
                    drag={false}
                    images={exampleImages()}/>
            </div>
        </>
    );
}