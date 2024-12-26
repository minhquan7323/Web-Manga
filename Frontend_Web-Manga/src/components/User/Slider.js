import React, { useState } from 'react'
import { Slider } from 'antd'

const formatNumber = (value) => value.toLocaleString('vi-VN') + ' VND'

const SliderComponent = ({ step, min, max, defaultValue, onFilter }) => {
    const [value, setValue] = useState(defaultValue)

    const handleChange = (newValue) => {
        setValue(newValue)
    }

    return (
        <>
            <Slider
                range
                step={step}
                min={min}
                max={max}
                defaultValue={defaultValue}
                onChange={handleChange}
                tooltip={{ formatter: formatNumber }}
            />
            <div className='item-center'>
                <button
                    className='btn btn-warning mt-2'
                    onClick={() => onFilter(value)}
                >
                    Filter
                </button>
            </div>
        </>
    )
}

export default SliderComponent
