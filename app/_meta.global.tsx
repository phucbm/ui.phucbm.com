import {MetaRecord} from "nextra";

const COMPONENTS: MetaRecord = {
    'text-ripple': '',
    'text-flower': '',
    // 'word-by-word': {display: 'hidden'},
    // 'spotlight-content': {display: 'hidden'},
    'infinite-grid': '',
    'magnetic': '',
    'moving-border': '',
    // 'image-carousel': {display: 'hidden'},
}


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