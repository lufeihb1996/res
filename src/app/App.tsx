import { useEffect, useState } from "react";
import { OrderingStorePage } from "../components/orders/OrderingStorePage";
import { repository, type RestaurantState } from "../data/repository";

export function App() {
  const [state, setState] = useState<RestaurantState>(() => repository.getState());

  useEffect(() => repository.subscribe(setState), []);

  return (
    <OrderingStorePage
      categories={state.categories}
      menuItems={state.menuItems}
      profile={state.profile}
      tags={state.tags}
      onCreateOrder={(input) => repository.createOrder(input)}
    />
  );
}
