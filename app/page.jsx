import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-35">
      <div className="flex w-full items-center gap-2">
        <Input type="text" placeholder="searchhh" />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </div>
      <div>images</div>
      <section>category</section>
      <section>product listing</section>
    </div>
  );
}
