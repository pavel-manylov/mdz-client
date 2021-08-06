import React, {useEffect, useState} from "react";
import {Alert, Button, Card, Col, Row, Spinner, Table} from "react-bootstrap";
import {Post} from "./api";
import Config from "./Config";

export function PostsIndex() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingError, setLoadingError] = useState<string | undefined>();
    const [postsLoaded, setPostsLoaded] = useState<boolean>(false);

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        load();
    }, []);

    async function load() {
        setLoading(true);
        setLoadingError(undefined);

        try {
            const postsResponse = await Config.postApi.indexPosts();
            setPosts(postsResponse.data);
            setPostsLoaded(true);
        } catch {
            setLoadingError('Произошла ошибка при загрузке публикаций');
        }

        setLoading(false);
    }

    return (
        <div>
            <Alert show={!!loadingError} variant="danger">
                <p>{loadingError}</p>
                <Button onClick={() => load()}>Повторить попытку</Button>
            </Alert>

            {loading ? <Spinner animation="border" variant="primary"/> : ''}

            {posts.length === 0 && postsLoaded ? <div>
                <p>Публикации отсутствуют</p>
            </div> : ''}
            {posts.length === 0 ? '' :
                <div>
                    <Row xs={1} md={2} className="g-4">
                        {posts.map((post, i) => (
                            <Col key={i} className="mb-4">
                                <Card>
                                    <Card.Header>Публикация</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{post.name}</Card.Title>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Button href={"/posts/" + post.id}>Читать</Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            }
        </div>
    )
}