export default function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Aquí puedes guardar los datos en tu base de datos MongoDB
            const metricData = JSON.parse(req.body);

            // Ejemplo para registrar en consola (en producción guardarías en DB)
            console.log('Web Vital métrica recibida:', metricData);

            res.status(200).json({ received: true });
        } catch (error) {
            console.error('Error procesando métricas:', error);
            res.status(500).json({ error: 'Error al procesar métricas' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}