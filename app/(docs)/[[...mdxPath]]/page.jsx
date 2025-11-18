import {generateStaticParamsFor, importPage} from 'nextra/pages'
import {useMDXComponents as getMDXComponents} from '../../../mdx-components'
import {DocsCopyPage} from "../../../components/docs-copy-page";
import {getDocsUrl} from "../../../lib/getDocsUrl";
import {generatePageMetadata} from "@phucbm/next-og-image";
import {_metadata} from "../../../lib/seo";
import {getRegistryItem} from "../../../lib/getRegistryItem";

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export const generateMetadata = generatePageMetadata(async(props) => {
    const params = await props.params;
    if(!params.mdxPath) return {};
    const {metadata} = await importPage(params.mdxPath)

    let registry = {};
    if(params.mdxPath){
        const name = Array.from(metadata.filePath.split('/')).pop().split('.')[0];
        if(name !== 'index'){
            registry = await getRegistryItem(name);
        }
    }

    const canonicalPath = params.mdxPath ? `/${params.mdxPath.join('/')}` : '/';

    const description = metadata.description ?? registry?.description ?? _metadata.description;

    let title = `${metadata.title} - ${_metadata.siteName}`;
    if(metadata.description || registry?.description){
        title = `${metadata.title}: ${metadata.description || registry?.description}`;
    }

    if(canonicalPath === '/'){
        // homepage
        title = `${_metadata.siteName}: ${_metadata.description}`
    }

    return {
        ..._metadata,
        title,
        canonicalPath,
        description,
        socialImage: {
            title: metadata.title,
        },
    };
});

const Wrapper = getMDXComponents().wrapper

export default async function Page(props) {
    const params = await props.params;
    const mdxPath = params.mdxPath;
    const {
        default: MDXContent,
        toc,
        metadata,
        sourceCode
    } = await importPage(mdxPath);

    return (
        <Wrapper toc={toc} metadata={metadata}>

            {/*copy buttons*/}
            {
                mdxPath && mdxPath[0] === 'components' &&
                <div className="absolute top-0 right-0 hidden lg:flex">
                    <DocsCopyPage page={sourceCode} url={getDocsUrl({mdxPath})} registryName={mdxPath[1]}/>
                </div>
            }

            <MDXContent {...props} params={params}/>
        </Wrapper>
    )
}