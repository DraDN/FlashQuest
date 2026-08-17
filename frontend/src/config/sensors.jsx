import { useSensors, useSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';

export default function useSensorsConfig() {
    const mouse_sensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5,
        },
    });

    const touch_sensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 200,
            tolerance: 5,
        },
    });

    const sensors_config = useSensors(mouse_sensor, touch_sensor);

    return sensors_config;
}
