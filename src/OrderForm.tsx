import {
  Box,
  Button,
  Callout,
  Flex,
  Heading,
  SegmentedControl,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { store } from "./data/portfolioStore";
import {
  formatDollars,
  ORDER_METHODS,
  ORDER_TYPE_LABELS,
  ORDER_TYPES,
  type OrderMethod,
  type OrderType,
  type StockOrder,
} from "./portfolio";
import { Link, navigate } from "./router";

interface Draft {
  symbol: string;
  method: OrderMethod;
  type: OrderType;
  price: string;
  quantity: string;
  date: string;
}

/** Today's date where you are, as "YYYY-MM-DD" (not UTC's, which can be tomorrow). */
function today(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function draftFrom(order: StockOrder | undefined): Draft {
  if (!order) {
    return { symbol: "", method: "buy", type: "market", price: "", quantity: "", date: today() };
  }
  return { ...order, price: String(order.price), quantity: String(order.quantity) };
}

/** What's wrong with the draft, field by field; empty when it can be saved. */
function problems(draft: Draft): Partial<Record<keyof Draft, string>> {
  const found: Partial<Record<keyof Draft, string>> = {};
  if (!draft.symbol.trim()) found.symbol = "Enter a symbol.";
  else if (!store.quote(draft.symbol)) found.symbol = "There's no quote for that symbol.";
  const price = Number(draft.price);
  if (!draft.price || !Number.isFinite(price) || price <= 0) found.price = "Enter a price above $0.";
  const quantity = Number(draft.quantity);
  if (!draft.quantity || !Number.isInteger(quantity) || quantity <= 0) {
    found.quantity = "Enter a whole number of shares.";
  }
  if (!draft.date) found.date = "Pick a date.";
  else if (draft.date > today()) found.date = "Pick a date that isn't in the future.";
  return found;
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <Box mb="4">
      <Text as="label" size="2" weight="medium" htmlFor={htmlFor} mb="1" className="field-label">
        {label}
      </Text>
      {children}
      {error && (
        <Text as="p" size="1" color="red" mt="1" role="alert">
          {error}
        </Text>
      )}
    </Box>
  );
}

/** The Add Stock Order form, also used to edit an order. */
export function OrderForm({ editing }: { editing?: string }) {
  const existing = editing ? store.orders().find((order) => order.id === editing) : undefined;
  const [draft, setDraft] = useState(() => draftFrom(existing));
  // Errors show once you've tried to save, so an empty form doesn't start out red.
  const [tried, setTried] = useState(false);
  const id = useId();
  const quote = store.quote(draft.symbol);
  const errors = tried ? problems(draft) : {};

  if (editing && !existing) {
    return (
      <Callout.Root color="red">
        <Callout.Text>
          That order doesn't exist (the demo resets on reload). <Link to="/stocks">Back to stocks</Link>.
        </Callout.Text>
      </Callout.Root>
    );
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save(event: FormEvent) {
    event.preventDefault();
    setTried(true);
    if (Object.keys(problems(draft)).length) return;
    const order = {
      symbol: draft.symbol.trim().toUpperCase(),
      method: draft.method,
      type: draft.type,
      price: Number(draft.price),
      quantity: Number(draft.quantity),
      date: draft.date,
    };
    if (existing) store.update({ ...order, id: existing.id });
    else store.add(order);
    navigate("/stocks");
  }

  return (
    <Box maxWidth="560px">
      <Heading as="h1" size="6" mb="4">
        {existing ? `Edit ${existing.symbol} order` : "Add stock order"}
      </Heading>
      <form onSubmit={save} noValidate>
        <Field label="Symbol" error={errors.symbol} htmlFor={`${id}-symbol`}>
          <TextField.Root
            id={`${id}-symbol`}
            list={`${id}-symbols`}
            value={draft.symbol}
            onChange={(event) => set("symbol", event.target.value.toUpperCase())}
            placeholder="SHWD"
            autoComplete="off"
            aria-invalid={Boolean(errors.symbol)}
          />
          <datalist id={`${id}-symbols`}>
            {store.quotes().map((option) => (
              <option key={option.symbol} value={option.symbol}>
                {option.name}
              </option>
            ))}
          </datalist>
          {quote && (
            <Text as="p" size="1" color="gray" mt="1">
              {quote.name}: asking {formatDollars(quote.ask)}, opened at {formatDollars(quote.open)}
            </Text>
          )}
        </Field>

        <Field label="Method">
          <SegmentedControl.Root
            value={draft.method}
            onValueChange={(value) => set("method", value as OrderMethod)}
            aria-label="Method"
          >
            {ORDER_METHODS.map((method) => (
              <SegmentedControl.Item key={method} value={method}>
                {method === "buy" ? "Buy" : "Sell"}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </Field>

        <Field label="Type">
          <SegmentedControl.Root
            value={draft.type}
            onValueChange={(value) => set("type", value as OrderType)}
            aria-label="Type"
            className="order-type"
          >
            {ORDER_TYPES.map((type) => (
              <SegmentedControl.Item key={type} value={type}>
                {ORDER_TYPE_LABELS[type]}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </Field>

        <Flex gap="4" wrap="wrap">
          <Box flexGrow="1" minWidth="160px">
            <Field label="Price" error={errors.price} htmlFor={`${id}-price`}>
              <TextField.Root
                id={`${id}-price`}
                inputMode="decimal"
                value={draft.price}
                onChange={(event) => set("price", event.target.value)}
                placeholder={quote ? quote.ask.toFixed(2) : "50.00"}
                aria-invalid={Boolean(errors.price)}
              >
                <TextField.Slot>$</TextField.Slot>
              </TextField.Root>
            </Field>
          </Box>
          <Box flexGrow="1" minWidth="160px">
            <Field label="Quantity" error={errors.quantity} htmlFor={`${id}-quantity`}>
              <TextField.Root
                id={`${id}-quantity`}
                inputMode="numeric"
                value={draft.quantity}
                onChange={(event) => set("quantity", event.target.value)}
                placeholder="20"
                aria-invalid={Boolean(errors.quantity)}
              />
            </Field>
          </Box>
        </Flex>

        <Field label="Date" error={errors.date} htmlFor={`${id}-date`}>
          <TextField.Root
            id={`${id}-date`}
            type="date"
            value={draft.date}
            max={today()}
            onChange={(event) => set("date", event.target.value)}
            aria-invalid={Boolean(errors.date)}
          />
        </Field>

        <Flex gap="3" mt="5">
          <Button type="submit" size="3">
            {existing ? "Save order" : "Add stock order"}
          </Button>
          <Button asChild size="3" variant="soft" color="gray">
            <Link to="/stocks">Cancel</Link>
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
