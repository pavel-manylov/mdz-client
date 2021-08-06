import {Post, PostReference} from "./api";
import React, {useEffect, useState} from "react";
import Config from "./Config";
import {Button, Card} from "react-bootstrap";

interface PostReferencePreviewProps {
    reference: PostReference
}

export function PostReferencePreview({reference}: PostReferencePreviewProps) {
    const [post, setPost] = useState<Post | undefined>();

    async function load() {
        try {
            const postResponse = await Config.postApi.getPost(reference.post_id as number);
            setPost(postResponse.data);
        } catch {
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (<div>
        {post === undefined ? '' : <Card>
            <Card.Body><Card.Title>{post.name}</Card.Title></Card.Body>
            <Card.Footer><Button variant="outline-secondary" href={"/posts/" + post.id}>Читать</Button></Card.Footer>
        </Card>}
    </div>)
}