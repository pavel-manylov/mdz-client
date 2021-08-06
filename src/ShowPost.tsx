import React, {useEffect, useState} from "react";
import './ShowPost.css';
import {useParams} from "react-router-dom";
import {Component, Post, PostReference} from "./api";
import Config from "./Config";
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {PostReferencePreview} from "./PostReferencePreview";
import ReactMarkdown from "react-markdown";

export function ShowPost() {
    let {id}: any = useParams();
    const [post, setPost] = useState<Post | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingError, setLoadingError] = useState<string | undefined>();
    const [components, setComponents] = useState<Component[] | undefined>();

    async function load() {
        setLoading(true);
        setLoadingError(undefined);

        try {
            const postResponse = await Config.postApi.getPost(id);
            const componentsResponse = await Config.componentApi.indexComponents(id);
            setPost(postResponse.data);
            setComponents(componentsResponse.data.filter(
                    c => c.public
                ).sort(
                    (a, b) => (a.order || 0) - (b.order || 0))
            );
        } catch {
            setLoadingError("При загрузке публикации произошла ошибка");
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    function getComponentValueView(component: Component): React.ReactNode {
        const dataProps: { [key: string]: string; } = {};

        if (component.custom_fields !== undefined) {
            const customFields = component.custom_fields as { [key: string]: string; };

            Object.keys(customFields).forEach(key =>
                dataProps["data-custom-field-" + key] = customFields[key]
            )
        }


        if (component.type === "relation") {
            return <Row>
                {(component.value as PostReference[]).map((postReference, i) =>
                    <Col xs={3} key={i}><PostReferencePreview reference={postReference}/></Col>
                )}
            </Row>
        } else if (component.type === "boolean") {
            return <div className={component.display_class} {...dataProps} title={component.display_class}>{component.value ? 'Да' : 'Нет'}</div>
        } else if (component.type === "string") {
            return <div className={component.display_class} {...dataProps} title={component.display_class}>
                <ReactMarkdown>{component.value as string}</ReactMarkdown>
            </div>
        }
    }

    return (
        <div className="ShowPost">
            <Alert show={!!loadingError} variant="danger">
                <p>{loadingError}</p>
                <Button onClick={e => load()}>Повторить попытку</Button>
            </Alert>

            {loading ? <Spinner animation="border" variant="primary"/> : ''}

            {(post === undefined || components === undefined) ? '' :
                <div className="post">
                    <div className="post_name">Внутреннее название: {post.name}</div>

                    {components.map((component, i) =>
                        <div className={"component component-"+ component.type} key={i}>{getComponentValueView(component)}</div>
                    )}
                </div>
            }
        </div>
    );
}