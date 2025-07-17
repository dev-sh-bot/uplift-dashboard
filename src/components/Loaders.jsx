import { ColorRing } from "react-loader-spinner";

export const LoadingSpinner = () => (
  <div className="h-screen w-full flex justify-center items-center">
    <ColorRing
      visible={true}
      height="180"
      width="180"
      colors={['#8484c1', "#8484c1", "#8484c1", "#8484c1", "#8484c1"]}
      wrapperStyle={{ margin: "0 auto" }}
    />
  </div>
);
