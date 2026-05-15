import { useState } from "react";
import type { ReservationInput } from "../../data/repository";

interface ReservationFormProps {
  onSubmit: (input: ReservationInput) => void;
}

interface ReservationFormState {
  customerName: string;
  contact: string;
  date: string;
  time: string;
  partySize: string;
  notes: string;
}

const initialState: ReservationFormState = {
  customerName: "",
  contact: "",
  date: "",
  time: "",
  partySize: "2",
  notes: "",
};

export function ReservationForm({ onSubmit }: ReservationFormProps) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update(field: keyof ReservationFormState, value: string): void {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate(): Record<string, string> {
    const nextErrors: Record<string, string> = {};
    const today = new Date().toISOString().slice(0, 10);
    if (!form.customerName.trim()) nextErrors.customerName = "请输入姓名";
    if (!form.contact.trim()) nextErrors.contact = "请输入手机号或邮箱";
    if (!form.date) nextErrors.date = "请选择日期";
    if (form.date && form.date < today) nextErrors.date = "不能选择过去日期";
    if (!form.time) nextErrors.time = "请选择时间";
    if (Number(form.partySize) < 1) nextErrors.partySize = "人数必须大于 0";
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
        onSubmit({
          customerName: form.customerName,
          contact: form.contact,
          date: form.date,
          time: form.time,
          partySize: Number(form.partySize),
          notes: form.notes,
        });
        setForm(initialState);
      }}
    >
      <label>
        姓名
        <input value={form.customerName} onChange={(event) => update("customerName", event.target.value)} />
        {errors.customerName ? <span className="field-error">{errors.customerName}</span> : null}
      </label>
      <label>
        联系方式
        <input value={form.contact} onChange={(event) => update("contact", event.target.value)} />
        {errors.contact ? <span className="field-error">{errors.contact}</span> : null}
      </label>
      <div className="form-grid">
        <label>
          日期
          <input type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
          {errors.date ? <span className="field-error">{errors.date}</span> : null}
        </label>
        <label>
          时间
          <input type="time" value={form.time} onChange={(event) => update("time", event.target.value)} />
          {errors.time ? <span className="field-error">{errors.time}</span> : null}
        </label>
      </div>
      <label>
        人数
        <input min="1" type="number" value={form.partySize} onChange={(event) => update("partySize", event.target.value)} />
        {errors.partySize ? <span className="field-error">{errors.partySize}</span> : null}
      </label>
      <label>
        备注
        <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} />
      </label>
      <button className="primary-button" type="submit">
        提交预订请求
      </button>
    </form>
  );
}
