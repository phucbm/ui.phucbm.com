import {generateStaticParamsFor, importPage} from 'nextra/pages'
import {useMDXComponents as getMDXComponents} from '../../../mdx-components'
import {DocsCopyPage} from "../../../components/docs-copy-page";
import {getDocsUrl} from "../../../lib/getDocsUrl";
import {generatePageMetadata} from "@phucbm/next-og-image";
import {_metadata} from "../../../lib/seo";

export const generateStaticParams = generateStaticParamsFor('mdxPath')

// export async function generateMetadata(props) {
//     const params = await props.params
//     const { metadata } = await importPage(params.mdxPath)
//     console.log('metadata', metadata)
//     return metadata
// }

// export const generateMetadata = generatePageMetadata({
//     ...metadata,
//     canonicalPath: "/",
//     // imageUrl: "/images/perxel.webp"
// });

export const generateMetadata = generatePageMetadata(async(props) => {
    const params = await props.params
    const {metadata} = await importPage(params.mdxPath)
    console.log('metadata', params.mdxPath.join('/'))

    return {
        ..._metadata,
        title: metadata.title,
        canonicalPath: `/${params.mdxPath.join('/')}`,
        // description: getMccIntroText(mcc).full,
        // socialImage: {
        //     title: `MCC: ${mcc.title}`,
        //     description: getMccIntroText(mcc).short,
        // },
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