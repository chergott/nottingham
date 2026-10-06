import { Container, Heading, Text } from "@radix-ui/themes";
import { DemoBanner } from "./DemoBanner";
import { NavBar } from "./NavBar";
import { OrderForm } from "./OrderForm";
import { Link, parseRoute, usePath } from "./router";
import { StocksPage } from "./StocksPage";

export function App() {
  const route = parseRoute(usePath());
  return (
    <Container size="3" px="4" py="5">
      <DemoBanner />
      <NavBar current={route.page} />
      {route.page === "stocks" && <StocksPage />}
      {route.page === "new" && <OrderForm />}
      {route.page === "edit" && <OrderForm editing={route.id} />}
      {route.page === "not-found" && (
        <>
          <Heading as="h1" size="6" mb="2">
            Page not found
          </Heading>
          <Text as="p" color="gray">
            <Link to="/stocks">Go to your stocks</Link>.
          </Text>
        </>
      )}
    </Container>
  );
}
