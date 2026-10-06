import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";

/** Says up front what kind of demo this is. */
export function DemoBanner() {
  return (
    <Callout.Root size="1" variant="surface" mb="4">
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        Nottingham is a stock portfolio tracker I built in 2016, rebuilt as a demo. The
        companies and quotes are made up, and changes reset when you reload.
      </Callout.Text>
    </Callout.Root>
  );
}
