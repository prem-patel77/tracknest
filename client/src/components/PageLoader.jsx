import Spinner from "./Spinner";

// Centered spinner shown while a whole page is loading
export default function PageLoader({ text = "Loading..." }) {
  return (
    <div className="page-loader">
      <Spinner />
      <p>{text}</p>
    </div>
  );
}
