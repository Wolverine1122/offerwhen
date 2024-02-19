import { useMutation, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { useRef } from "react";
import { createNewOnlineAssessmentData } from "./Api";

const NewPost = ({ company }) => {
  const dateRef = useRef();
  const scoredRef = useRef();
  const totalRef = useRef();
  const statusRef = useRef();

  const queryClient = useQueryClient();

  const createNewPostMutation = useMutation({
    mutationFn: createNewOnlineAssessmentData,
    onSuccess: (data) => {
      queryClient.setQueryData(["company", company], data);
      queryClient.invalidateQueries(["company", company], {
        exact: true,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewPostMutation.mutate({
      date: dateRef.current.value,
      scored: scoredRef.current.value,
      total: totalRef.current.value,
      status: statusRef.current.value,
    });
  };

  return (
    <div>
      {createNewPostMutation.isError &&
        JSON.stringify(createNewPostMutation.error)}
      <h2>New Post</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={dateRef} placeholder="Date" />
        <input type="number" ref={scoredRef} placeholder="Scored" />
        <input type="number" ref={totalRef} placeholder="Total" />
        <input type="text" ref={statusRef} placeholder="Status" />
        <button disabled={createNewPostMutation.isLoading} type="submit">
          {createNewPostMutation.isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

NewPost.propTypes = {
  company: propTypes.string.isRequired,
};

export default NewPost;
