import { Form, Input, Icon, Button } from 'antd';
import React from 'react';
import { genID, isString } from '@/utils/utils.js';
let id = 0;

class DynamicFieldSet extends React.Component {

    componentDidMount() {
        this.add();
    }
    remove = k => {
        const { form, onChange } = this.props;
        let value = this.props.value || [];
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        value = value.filter(item => item.id !== k);

        if (onChange) {
            onChange(value)
        }
        onChange(value)
        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form, onChange } = this.props;
        const value = this.props.value || [];
        const id = genID();
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id);

        if (onChange) {
            onChange([...value, {
                id,
                name: '',
            }])
        }
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    onChangeInput = (event, k) => {
        const name = event && event.target && event.target.value || '';
        const { onChange } = this.props;
        const value = this.props.value || [];

        if (!onChange) return;

        if (value.length <= 0) {
            onChange([...value, {
                name,
                id: k || genID(),
            }]);
            return
        }

        let isRepeat = false;//是否已存在相同id的
        let contrastArr = value.map(item => {
            if (k === item.id) {
                item.name = name;
                isRepeat = true;
            }
            return item;
        })

        if (isRepeat) {
            onChange(contrastArr);
        } else {
            onChange([...contrastArr, {
                name,
                id: genID(),
            }]);
        }

    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                console.log('Received values of form: ', values);
                console.log('Merged values:', keys.map(key => names[key]));
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const formItemLayout = {
            labelCol: {
                span: 5,
            },
            wrapperCol: {
                span: 19,
            },
        };

        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                {...formItemLayout}
                required={false}
                key={k}
            >
                {getFieldDecorator(`names[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "请输入",
                        },
                    ],
                })(<Input placeholder="请输入" style={{ width: '60%', marginRight: 8 }} onChange={(e) => this.onChangeInput(e, k)} />)}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));
        return (
            <Form onSubmit={this.handleSubmit}>
                {formItems}
                <Form.Item {...formItemLayout}>
                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                        <Icon type="plus" /> 添加用户
                    </Button>
                </Form.Item>
                {/* <Form.Item {...formItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item> */}
            </Form>
        );
    }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);
export default WrappedDynamicFieldSet;
