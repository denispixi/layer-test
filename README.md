# TBK-LIB

## Detalles:

Tener un metodo para ponerlo en modo pagando y otro para ponerlo en modo pagado

En que momento se crearía el item correspondiente a una orden de pago en la tabla
    -> se tendrá un metodo que dé de alta el balance en la tabla

## campos:
    id balance
    id orden de pago
    status (pending, processing, paid)
    fecha del ultimo intento de cobro (la fecha cuando el intento termina sea success o error)

## Metodos:

startPayment(id_balance, id_orden_pago, monto)
    -> inicia un proceso de pago de una orden.
        Tiene como condicion que el status sea pending
        Transaccional

updatePaymentStatus(id_balance, id_orden_pago)
    -> actualiza el status de una orden de pago.
        Tiene como condicion que el status sea processing (id)
        Transaccional

crearOrdenDePago(id_balance, id_orden_pago, monto)
    -> crea un registro para una orden de pago en DynamoDb (cierre de balance)

