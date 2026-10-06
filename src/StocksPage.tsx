import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  Badge,
  Button,
  Flex,
  Heading,
  IconButton,
  Table,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { useState } from "react";
import { store, useOrders } from "./data/portfolioStore";
import {
  formatDollars,
  formatPercent,
  orderReturns,
  ORDER_TYPE_LABELS,
  type StockOrder,
} from "./portfolio";
import { Link, navigate } from "./router";

/** Green for a gain, red for a loss. */
function gainColor(amount: number) {
  return amount > 0 ? "green" : amount < 0 ? "red" : "gray";
}

/** The portfolio: each order with its quote and returns, as the 2016 app's table. */
export function StocksPage() {
  const orders = useOrders();
  const [removing, setRemoving] = useState<StockOrder | null>(null);
  const rows = orders.map((order) => {
    const quote = store.quote(order.symbol);
    return { order, quote, returns: quote ? orderReturns(order, quote) : null };
  });
  const todayTotal = rows.reduce((sum, row) => sum + (row.returns?.today ?? 0), 0);
  const total = rows.reduce((sum, row) => sum + (row.returns?.total ?? 0), 0);

  return (
    <>
      <Flex justify="between" align="center" gap="3" mb="4" wrap="wrap">
        <Heading as="h1" size="6">
          Stocks
        </Heading>
        <Button asChild>
          <Link to="/stocks/new">
            <PlusIcon /> Add stock order
          </Link>
        </Button>
      </Flex>

      {orders.length === 0 ? (
        <Text as="p" color="gray" align="center" my="9">
          No stock orders yet. <Link to="/stocks/new">Add one</Link>.
        </Text>
      ) : (
        <Table.Root variant="surface" className="stocks-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Symbol</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="end" className="wide-only">
                Quantity
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="end" className="wide-only">
                Base price
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="end" className="wide-only">
                Asking price
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="end">Today's return</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="end">Total return</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <span className="visually-hidden">Actions</span>
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map(({ order, quote, returns }) => (
              <Table.Row key={order.id} align="center">
                <Table.RowHeaderCell>
                  <Flex direction="column" gap="1">
                    <Flex align="center" gap="2">
                      <Text weight="bold">{order.symbol}</Text>
                      {order.method === "sell" && (
                        <Badge color="orange" size="1">
                          Sell
                        </Badge>
                      )}
                    </Flex>
                    <Text size="1" color="gray">
                      {quote?.name ?? "No quote"} · {ORDER_TYPE_LABELS[order.type]} ·{" "}
                      {order.date}
                    </Text>
                    {/* The three hidden columns, in a line, on narrow screens. */}
                    <Text size="1" className="narrow-only">
                      {order.quantity} × {formatDollars(order.price)}
                      {quote && ` · ask ${formatDollars(quote.ask)}`}
                    </Text>
                  </Flex>
                </Table.RowHeaderCell>
                <Table.Cell justify="end" className="wide-only">
                  {order.quantity}
                </Table.Cell>
                <Table.Cell justify="end" className="wide-only">
                  {formatDollars(order.price)}
                </Table.Cell>
                <Table.Cell justify="end" className="wide-only">
                  {quote ? formatDollars(quote.ask) : "—"}
                </Table.Cell>
                <Table.Cell justify="end">
                  {returns ? (
                    <Text color={gainColor(returns.today)}>{formatDollars(returns.today)}</Text>
                  ) : (
                    "—"
                  )}
                </Table.Cell>
                <Table.Cell justify="end">
                  {returns ? (
                    <Flex direction="column" align="end">
                      <Text color={gainColor(returns.total)}>{formatDollars(returns.total)}</Text>
                      <Text size="1" color={gainColor(returns.total)}>
                        {formatPercent(returns.totalPercent)}
                      </Text>
                    </Flex>
                  ) : (
                    "—"
                  )}
                </Table.Cell>
                <Table.Cell justify="end">
                  <Flex gap="3" justify="end">
                    <Tooltip content="Edit">
                      <IconButton
                        variant="ghost"
                        color="gray"
                        aria-label={`Edit ${order.symbol} order`}
                        onClick={() => navigate(`/stocks/${order.id}/edit`)}
                      >
                        <Pencil1Icon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Remove">
                      <IconButton
                        variant="ghost"
                        color="red"
                        aria-label={`Remove ${order.symbol} order`}
                        onClick={() => setRemoving(order)}
                      >
                        <TrashIcon />
                      </IconButton>
                    </Tooltip>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <tfoot>
            <Table.Row className="stocks-total">
              <Table.RowHeaderCell>
                <Text weight="bold">Portfolio</Text>
              </Table.RowHeaderCell>
              <Table.Cell className="wide-only" colSpan={3} />
              <Table.Cell justify="end">
                <Text weight="bold" color={gainColor(todayTotal)}>
                  {formatDollars(todayTotal)}
                </Text>
              </Table.Cell>
              <Table.Cell justify="end">
                <Text weight="bold" color={gainColor(total)}>
                  {formatDollars(total)}
                </Text>
              </Table.Cell>
              <Table.Cell />
            </Table.Row>
          </tfoot>
        </Table.Root>
      )}

      {/* Asks first, as the 2016 app did, but in a dialog instead of the browser's. */}
      <AlertDialog.Root open={removing !== null} onOpenChange={(open) => !open && setRemoving(null)}>
        <AlertDialog.Content maxWidth="420px">
          <AlertDialog.Title>Remove this order?</AlertDialog.Title>
          <AlertDialog.Description size="2">
            {removing &&
              `${removing.method === "sell" ? "Sell" : "Buy"} ${removing.quantity} ${removing.symbol} at ${formatDollars(removing.price)} on ${removing.date}.`}
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={() => removing && store.remove(removing.id)}>
                Remove
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
}
