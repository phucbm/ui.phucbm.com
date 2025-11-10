import {MetaRecord} from "nextra";
import {getComponentPages} from "@/lib/getComponentPages";

const COMPONENTS: MetaRecord = await getComponentPages('content/components');

export default {
    components: {
        type: 'doc',
        title: 'Components',
        items: COMPONENTS
    },
    dev: {
        type: 'page',
        display: 'hidden'
    }
}