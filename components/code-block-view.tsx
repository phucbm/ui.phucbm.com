'use client';
import type {BundledLanguage} from '@/components/ui/shadcn-io/code-block';
import {
    CodeBlock,
    CodeBlockBody,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockFilename,
    CodeBlockFiles,
    CodeBlockHeader,
    CodeBlockItem,
    CodeBlockSelect,
    CodeBlockSelectContent,
    CodeBlockSelectItem,
    CodeBlockSelectTrigger,
    CodeBlockSelectValue,
} from '@/components/ui/shadcn-io/code-block';
import {cn} from "@/lib/utils";

type CodeItem = {
    language: BundledLanguage;
    filename: string;
    code: string;
};

type Props = {
    code: CodeItem[],
    contentClassName?: string;
}

const CodeBlockView = ({code, contentClassName}: Props) => (
    <CodeBlock data={code} defaultValue={code[0].language} className="px-border">
        <CodeBlockHeader>
            <CodeBlockFiles>
                {(item) => (
                    <CodeBlockFilename key={item.language} value={item.language}>
                        {item.filename}
                    </CodeBlockFilename>
                )}
            </CodeBlockFiles>
            <CodeBlockSelect>
                <CodeBlockSelectTrigger>
                    <CodeBlockSelectValue/>
                </CodeBlockSelectTrigger>
                <CodeBlockSelectContent>
                    {(item) => (
                        <CodeBlockSelectItem key={item.language} value={item.language}>
                            {item.language}
                        </CodeBlockSelectItem>
                    )}
                </CodeBlockSelectContent>
            </CodeBlockSelect>
            <CodeBlockCopyButton
                onCopy={() => console.log('Copied code to clipboard')}
                onError={() => console.error('Failed to copy code to clipboard')}
            />
        </CodeBlockHeader>
        <CodeBlockBody>
            {(item) => (
                <CodeBlockItem key={item.language} value={item.language}>
                    <CodeBlockContent language={item.language as BundledLanguage}
                                      themes={{light: 'github-light', dark: 'github-dark'}}
                                      className={cn("max-h-[450px] overflow-auto", contentClassName)}
                    >
                        {item.code}
                    </CodeBlockContent>
                </CodeBlockItem>
            )}
        </CodeBlockBody>
    </CodeBlock>
);
export default CodeBlockView;