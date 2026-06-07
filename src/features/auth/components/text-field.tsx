import { Field, FieldDescription, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * A labelled text input wired for react-hook-form. Spread `register("field")`
 * onto it for value/ref binding and pass `error` for the validation message.
 *
 * When invalid, the validation message replaces the helper text inside a
 * `FieldDescription` and is announced to assistive tech.
 */
export function TextField({
  id,
  label,
  description,
  error,
  ...inputProps
}: React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  description?: string;
  error?: string;
}) {
  const invalid = Boolean(error);
  const message = error ?? description;

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={id} className="text-muted-foreground">
        {label}
      </FieldLabel>
      <Input
        id={id}
        aria-invalid={invalid}
        aria-describedby={message ? `${id}-description` : undefined}
        className="h-12 rounded-xl"
        {...inputProps}
      />
      {message && (
        <FieldDescription
          id={`${id}-description`}
          className={cn(invalid && "text-destructive")}
        >
          {message}
        </FieldDescription>
      )}
    </Field>
  );
}
