import {InfiniteGrid} from "@/registry/perxel/blocks/infinite-grid/infinite-grid";
import {exampleImages} from "@/utils/demo-images";

export default function Example() {
    const images = exampleImages.map(item => {
        return {url: item.url, alt: item.title}
    })
    return <InfiniteGrid images={images}/>
}