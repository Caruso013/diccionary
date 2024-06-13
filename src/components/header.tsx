
import { Book, Moon} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Header() {

    return(
      <>
        <header className='flex justify-between'>
        <Book size={42} color="#999999" />
        <div className="flex gap-4">
        <Switch />
        <Moon size={30} color="#999999"/>
        </div>
      </header>
      </>
    )
}