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

  const doOp = async (endpoint: string, val: string, setVal?: Function, isQueue: boolean = true) => {
    try {
      const res = await api.post(endpoint, val ? { value: parseInt(val) } : {});
      // Only fetch the structure that was modified
      if (isQueue) {
        const q = await api.get("/queue");
        setQueueData(q.data.queue_data || []);
      } else {
        const d = await api.get("/deque");
        setDequeData(d.data.deque_data || []);
      }
      setVal?.("");
      toast({ title: "Success", description: res.data.removed ? `Removed ${res.data.removed}` : "Done" });
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.error || "Failed", variant: "destructive" });
    }
  };

  const Section = ({ title, desc, input, setInput, buttons, data }: any) => (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <h1 className="font-cubic text-4xl md:text-6xl text-center mb-8">
          <span className={title === "QUEUE" ? "text-foreground" : "text-primary"}>{title}</span>
        </h1>
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-frankfurter text-lg text-foreground mb-6">{desc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <input type="number" placeholder="Enter number" value={input} onChange={(e) => setInput(e.target.value)} className="border rounded px-4 py-2 text-lg text-accent-foreground" />
            {buttons.map((b: any, i: number) => (
              <Button key={i} onClick={b.onClick} className={b.accent ? "bg-accent hover:bg-primary text-accent-foreground font-frankfurter px-6 py-2" : "bg-primary hover:bg-accent text-primary-foreground font-frankfurter px-6 py-2"}>
                {b.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            {data.length === 0 ? <p className="text-foreground font-frankfurter">{title} is empty</p> : data.map((item: number, i: number) => <div key={i} className="bg-primary text-primary-foreground font-frankfurter px-6 py-3 rounded-lg text-lg">{item}</div>)}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Section title="QUEUE" desc="Add numbers to the rear and remove numbers from the front." input={queueInput} setInput={setQueueInput} buttons={[{ label: "Enqueue", onClick: () => doOp("/queue/enqueue", queueInput, setQueueInput) }, { label: "Dequeue", onClick: () => doOp("/queue/dequeue", ""), accent: true }]} data={queueData} />
      <Section title="DEQUE" desc="Add numbers to the rear and remove numbers from the front and rear." input={dequeInput} setInput={setDequeInput} buttons={[{ label: "Enqueue", onClick: () => doOp("/deque/enqueue", dequeInput, setDequeInput) }, { label: "Dequeue", onClick: () => doOp("/deque/dequeue", "") }, { label: "Enqueue Head", onClick: () => doOp("/deque/enqueue-head", dequeInput, setDequeInput), accent: true }, { label: "Dequeue Tail", onClick: () => doOp("/deque/dequeue-tail", ""), accent: true }]} data={dequeData} />
      <Footer />
    </div>
  );
};

export default WorksQueueDequeue;