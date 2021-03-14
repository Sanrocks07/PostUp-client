import React from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  // const [error, setError] = useState({});

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    //error handling
    onError(error) {
      console.log(error);
    },
    //    refetchQueries: [{ query: FETCH_POSTS_QUERY}],

    //og

    // update(proxy, result) {
    //   const data = proxy.readQuery({
    //     query: FETCH_POSTS_QUERY,
    //   });
    //   data.getPosts = [result.data.createPost, ...data.getPosts];
    //   proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
    //   // console.log(result);
    //   values.body = "";
    // },

    //og

    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
    },

    // update(proxy, result) {
    //     const data = proxy.readQuery({
    //       query: FETCH_POSTS_QUERY
    //     })
    //     //data.getPosts = [result.data.getPosts, ...data.getPosts];
    //     proxy.writeQuery({
    //       query: FETCH_POSTS_QUERY,
    //       data: [result.data.getPosts, ...data.getPosts]
    //     });
    //     values.body = '';
    //   },
    //   refetchQueries: refetchPosts => [{ query: FETCH_POSTS_QUERY }]
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Post Up"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
