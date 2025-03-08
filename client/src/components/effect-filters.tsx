import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLocation } from "wouter";

const COMMON_EFFECTS = [
  "happy",
  "relaxed",
  "euphoric",
  "uplifted",
  "creative",
  "energetic",
  "focused",
  "sleepy",
  "tingly",
  "hungry"
];

export default function EffectFilters() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const selectedEffects = searchParams.getAll('effect');

  const toggleEffect = (effect: string) => {
    const params = new URLSearchParams(location.split('?')[1]);
    
    if (selectedEffects.includes(effect)) {
      // Remove effect
      const effects = params.getAll('effect').filter(e => e !== effect);
      params.delete('effect');
      effects.forEach(e => params.append('effect', e));
    } else {
      // Add effect
      params.append('effect', effect);
    }
    
    const query = params.toString();
    setLocation(`/${query ? `?${query}` : ''}`);
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Filter by Effects</h3>
      <div className="flex flex-wrap gap-2">
        {COMMON_EFFECTS.map((effect) => (
          <Button
            key={effect}
            variant={selectedEffects.includes(effect) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleEffect(effect)}
            className="capitalize"
          >
            {selectedEffects.includes(effect) && (
              <Check className="mr-1 h-4 w-4" />
            )}
            {effect}
          </Button>
        ))}
      </div>
    </div>
  );
}
