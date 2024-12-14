import imageBanner from "../assets/home-page-banner.jpg";
import Form from "../components/Form";
const Home = () => {
  const removeHighlightText = () => {
    window.getSelection().removeAllRanges();
  };
  return (
    <section className="h-screen overflow-x-hidden flex flex-col w-full items-start md:justify-stretch justify-evenly md:pt-72">
      <img
        onClick={removeHighlightText}
        src={imageBanner}
        alt="imageBanner"
        className="opacity-40 w-full h-screen object-cover absolute top-20 -z-20"
      />

      <h1 className="lg:text-6xl text-[3rem] font-bold text-center sm:pl-12 md:mb-8">
        Navigate Roads with Comfort
      </h1>

      <div className="bg-white w-[94%] rounded-md mx-auto min-h-52 pt-5 px-12">
        <h4 className="text-3xl">Find your bus & travel</h4>

        {/* Form */}
        <Form />
      </div>
    </section>
  );
};

export default Home;
