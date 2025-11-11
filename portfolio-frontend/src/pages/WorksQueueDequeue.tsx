import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const WorksQueueDequeue = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="font-cubic text-4xl md:text-6xl text-center mb-8">
            <span className="text-foreground">QUEUE </span>
          </h1>
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-frankfurter text-lg text-foreground mb-6">
              Add numbers to the rear and remove numbers from the front.
            </p>

            {/* Input and buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <input
                type="number"
                placeholder="Enter number"
                className="border rounded px-4 py-2 text-lg text-accent-foreground"
              />
              <Button className="bg-primary hover:bg-accent text-primary-foreground font-frankfurter px-6 py-2">
                Enqueue
              </Button>
              <Button  className="bg-accent hover:bg-primary text-accent-foreground font-frankfurter px-6 py-2">
                Dequeue
              </Button>
            </div>

            {/* Queue display */}
            <div className="flex gap-4 justify-center flex-wrap">
                <p className="text-foreground font-frankfurter">Queue is empty</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="font-cubic text-4xl md:text-6xl text-center mb-8">
            <span className="text-primary">DEQUE</span>
          </h1>
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-frankfurter text-lg text-foreground mb-6">
              Add numbers to the rear and remove numbers from the front and rear.
            </p>

            {/* Input and buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <input
                type="number"
                placeholder="Enter number"
                className="border rounded px-4 py-2 text-lg text-accent-foreground"
              />
              <Button className="bg-primary hover:bg-accent text-primary-foreground font-frankfurter px-6 py-2">
                Enqueue
              </Button>
              <Button className="bg-primary hover:bg-accent text-primary-foreground font-frankfurter px-6 py-2">
                Dequeue
              </Button>
              <Button  className="bg-accent hover:bg-primary text-accent-foreground font-frankfurter px-6 py-2">
                Enqueue Head
              </Button>
              <Button  className="bg-accent hover:bg-primary text-accent-foreground font-frankfurter px-6 py-2">
                Dequeue Tail
              </Button>
            </div>

            {/* Queue display */}
            <div className="flex gap-4 justify-center flex-wrap">
                <p className="text-foreground font-frankfurter">Queue is empty</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WorksQueueDequeue;