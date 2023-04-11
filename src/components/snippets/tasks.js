import { CodeBlock, dracula, github } from "react-code-blocks";
import React from 'react'

export default function tasks() {
    
    const code = `return (
        <>
            <Card >
                <Card.Header>
                    <Card.Title>
                        Person
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <ReactCodeSinppet lang="jsx" code={<div>Hello world</div>}>
                        <div>Hello wrorld</div>
                    </ReactCodeSinppet>
                    <CodeBlock
                        text={""}
                        language={"jsx"}
                        showLineNumbers={true}
                        startingLineNumber={1}
                        theme={dracula}
                    />
                </Card.Body>
            </Card>
        </>
    )`

    return (
        <>
            <CodeBlock
                text={code}
                language={"jsx"}
                showLineNumbers={true}
                startingLineNumber={1}
                theme={dracula}
            />
        </>
    )
}
