import Header from "@/components/Header";
import Footer from "@/components/Footer";
const SortingAlgorithms = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-top bg-no-repeat"
      style={{backgroundImage: "url('/background/home-page.png')"}}
    >
      <Header />
            <main className="pt-32 md:pt-40 pb-12 px-6">
                <h1 className="font-header text-6xl md:text-7xl lg:text-8xl text-center mb-12">
                    <span className="text-white">SORTING ALGORITHMS </span>
                    <span className="text-[#f181b6]">VISUALIZER</span>
                </h1>
                <div className="max-w-[1400px] mx-auto">
                    <p className="font-body text-lg text-center text-foreground mb-12 max-w-4xl mx-auto">
                        This is a placeholder page for the Sorting Algorithms visualizer. The implementation is coming soon!
                    </p>
                </div>
            </main>
      <Footer />
    </div>
  );
};

export default SortingAlgorithms;
