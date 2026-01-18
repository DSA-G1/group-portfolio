import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const WorksQueueDequeue = () => {
  const { toast } = useToast();
  const [queueInput, setQueueInput] = useState("");
  const [dequeInput, setDequeInput] = useState("");
  const [queueData, setQueueData] = useState<number[]>([]);
  const [dequeData, setDequeData] = useState<number[]>([]);

  useEffect(() => {
    Promise.all([api.get("/queue"), api.get("/deque")]).then(([q, d]) => {
      setQueueData(q.data.queue_data || []);
      setDequeData(d.data.deque_data || []);
    });
  }, []);

  const doOp = async (
    endpoint: string,
    val: string,
    setVal?: Function,
    isQueue: boolean = true
  ) => {
    try {
      const res = await api.post(endpoint, val ? { value: parseInt(val) } : {});
      if (isQueue) {
        const q = await api.get("/queue");
        setQueueData(q.data.queue_data || []);
      } else {
        const d = await api.get("/deque");
        setDequeData(d.data.deque_data || []);
      }
      setVal?.("");
      toast({
        title: "Success",
        description: res.data.removed ? `Removed ${res.data.removed}` : "Done",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.response?.data?.error || "Failed",
        variant: "destructive",
      });
    }
  };

  const Section = ({
    title,
    desc,
    input,
    setInput,
    buttons,
    data,
  }: any) => (
    <section className="pt-10 pb-10 px-4 relative z-10">
      <div className="container mx-auto">
        <h1 className="font-body text-5xl md:text-7xl text-center mb-8">
          <span
            className={
              title === "QUEUE" ? "text-foreground" : "text-primary"
            }
          >
            {title}
          </span>
        </h1>
        <div className="max-w-4xl mx-auto text-center bg-[#1f1131] rounded-[40px] border-[4px] border-[#ffcaef] p-6 relative z-20">
          <p className="font-frankfurter text-lg text-foreground mb-6">
            {desc}
          </p>
          <div className="bg-[#1f1131] rounded-[40px] pb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <input
                className="w-[300px] px-4 bg-[#1f1131] border-[4px] border-[#ffcaef] text-white p-3 rounded-[17px] font-body placeholder:text-gray-400 pb-4 mx-auto sm:mx-0"
                placeholder="Enter number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex gap-4 flex-wrap justify-center sm:justify-start ml-4">
                {buttons.map((b: any, i: number) => (
                  <Button
                    key={i}
                    onClick={b.onClick}
                    className={
                      b.accent
                        ? "bg-accent hover:bg-primary text-accent-foreground font-frankfurter px-auto py-2 border-[4px] border-white"
                        : "bg-primary hover:bg-accent text-primary-foreground font-frankfurter px-auto py-2 border-[4px] border-white"
                    }
                  >
                    {b.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            {data.length === 0 ? (
              <p className="text-foreground font-body">{title} is empty</p>
            ) : (
              data.map((item: number, i: number) => (
                <div
                  key={i}
                  className="bg-primary text-primary-foreground font-frankfurter px-6 py-3 rounded-lg text-lg"
                >
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/background/home-page.png')` }}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 12px; width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffcaef; border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #493463ff; border-radius: 999px; }
      `}</style>
      <Header />
      <main className="pt-24 pb-12 px-6">
        <h1 className="font-header text-6xl md:text-7xl lg:text-8xl text-center mb-12">
          <span className="text-white">QUEUE & DEQUE </span>
          <span className="text-[#f181b6]">VISUALIZER</span>
        </h1>
        <div className="max-w-[1400px] mx-auto">
          <Section
            title="QUEUE"
            desc="Add numbers to the rear and remove numbers from the front."
            input={queueInput}
            setInput={setQueueInput}
            buttons={[
              {
                label: "Enqueue",
                onClick: () => doOp("/queue/enqueue", queueInput, setQueueInput),
              },
              {
                label: "Dequeue",
                onClick: () => doOp("/queue/dequeue", ""),
                accent: true,
              },
            ]}
            data={queueData}
          />
          <Section
            title="DEQUE"
            desc="Add numbers to the rear and remove numbers from the front and rear."
            input={dequeInput}
            setInput={setDequeInput}
            buttons={[
              {
                label: "Enqueue",
                onClick: () => doOp("/deque/enqueue", dequeInput, setDequeInput),
              },
              {
                label: "Dequeue",
                onClick: () => doOp("/deque/dequeue", ""),
              },
              {
                label: "Enqueue Head",
                onClick: () =>
                  doOp("/deque/enqueue-head", dequeInput, setDequeInput),
                accent: true,
              },
              {
                label: "Dequeue Tail",
                onClick: () => doOp("/deque/dequeue-tail", ""),
                accent: true,
              },
            ]}
            data={dequeData}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorksQueueDequeue;
