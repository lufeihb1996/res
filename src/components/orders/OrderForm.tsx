import { useState } from "react";
import type { CartItem } from "../../domain/menu";
import type { OrderInput } from "../../data/repository";

interface OrderFormProps {
  cartItems: CartItem[];
  onSubmit: (input: OrderInput) => void;
}

export function OrderForm({ cartItems, onSubmit }: OrderFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [fulfillment, setFulfillment] = useState("到店自取");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): Record<string, string> {
    const nextErrors: Record<string, string> = {};
    if (cartItems.length === 0) nextErrors.cart = "请先添加菜品";
    if (!customerName.trim()) nextErrors.customerName = "请输入姓名";
    if (!contact.trim()) nextErrors.contact = "请输入手机号或邮箱";
    if (!fulfillment.trim()) nextErrors.fulfillment = "请选择取餐方式";
    return nextErrors;
  }

  return (
    <form
      className="stack-form"
      onSubmit={(event) => {
        event.preventDefault();
        const nextErrors = validate();
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        onSubmit({ customerName, contact, fulfillment, notes, cartItems });
        setCustomerName("");
        setContact("");
        setFulfillment("到店自取");
        setNotes("");
      }}
    >
      {errors.cart ? <p className="field-error">{errors.cart}</p> : null}
      <label>
        姓名
        <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
        {errors.customerName ? <span className="field-error">{errors.customerName}</span> : null}
      </label>
      <label>
        联系方式
        <input value={contact} onChange={(event) => setContact(event.target.value)} />
        {errors.contact ? <span className="field-error">{errors.contact}</span> : null}
      </label>
      <label>
        取餐方式
        <select value={fulfillment} onChange={(event) => setFulfillment(event.target.value)}>
          <option>到店自取</option>
          <option>到店堂食</option>
        </select>
        {errors.fulfillment ? <span className="field-error">{errors.fulfillment}</span> : null}
      </label>
      <label>
        备注
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
      </label>
      <button className="primary-button" type="submit">
        提交点单请求
      </button>
    </form>
  );
}
