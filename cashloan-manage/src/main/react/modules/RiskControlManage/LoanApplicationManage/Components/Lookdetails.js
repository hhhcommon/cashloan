import React from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Col,
  Select,
  Tabs,
} from 'antd';

import RuleReport from './RuleReport';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import Tab4 from './Tab4';
import Tab5 from './Tab5';
import Tab6 from './Tab6';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
var confirm = Modal.confirm;

var Lookdetails = React.createClass({
  getInitialState() {
    return {
      checked: true,
      disabled: false,
      data: "",
      timeString: "",
      record: "",
      firstValue: "3"
    };
  },
  handleCancel() {
    this.props.form.resetFields();
    this.props.hideModal();
  },
  handleChangeOption(v) {
    this.setState({
      firstValue: v
    })
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      record: nextProps.record
    })
  },
  handleOk() {

    let me = this;
    let params = this.props.form.getFieldsValue();
    let record = this.state.record;
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        //console.log('Errors in form!!!');
        return;
      }
      var tips = '是否确定提交';
      confirm({
        title: tips,
        onOk: function () {
          Utils.ajaxData({
            url: '/modules/manage/borrow/verifyBorrow.htm',
            data: { borrowId: record.id, state: params.state, unstate: params.unstate, remark: params.remark },
            callback: (result) => {
              if (result.code == 200) {
                me.handleCancel();
              };
              let resType = result.code == 200 ? 'success' : 'warning';
              Modal[resType]({
                title: result.msg,
              });
            }
          });
        },
        onCancel: function () { }
      })

    })

  },
  onChange(time, timeString) {
    //console.log(time, timeString);
    this.setState({
      timeString: timeString,
    })
  },
  render() {
    const {
      getFieldProps
    } = this.props.form;
    var props = this.props;
    var state = this.state;
    var modalBtns = [
      <button key="back" className="ant-btn" onClick={this.handleCancel}>Cancel</button>,
      <button key="sure" className="ant-btn ant-btn-primary" onClick={this.handleOk}>OK</button>
    ];
    var modalBtnstwo = [
      <button key="back" className="ant-btn" onClick={this.handleCancel}>Exit</button>,
    ];
    const formItemLayout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 12
      },
    };
    const formItemLayouttwo = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      },
    };

    return (
      <Modal title={props.title} visible={props.visible} onCancel={this.handleCancel} width="1200" footer={props.title == "查看" ? [modalBtnstwo] : [modalBtns]} maskClosable={false} >

        <Tabs defaultActiveKey="1"  >
          <TabPane tab="Manual Review" key='1'>{/*人工复审*/} 
            <RuleReport record={this.props.record} visible={props.visible} />
          </TabPane>
          <TabPane tab="Basic Message" key="2">{/*基本信息*/}
            <Tab1 record={props.record} dataForm={props.dataForm} ref="Tab1" canEdit={props.canEdit} visible={props.visible} recordSoure={props.recordSoure} />
          </TabPane>
          <TabPane tab="Address Book" key="3">{/*通讯录*/}
            <Tab2 record={props.record} ref="Tab2" canEdit={props.canEdit} visible={props.visible} />
          </TabPane>
          <TabPane tab="Call Records" key="4">{/*通话记录*/}
            <Tab3 record={props.record} ref="Tab3" canEdit={props.canEdit} visible={props.visible} />
          </TabPane>
          {/*<TabPane tab="运营商通话记录" key="5">
            <Tab4 record={props.record} ref="Tab4" canEdit={props.canEdit} visible={props.visible} />
          </TabPane>*/}
          <TabPane tab="SMS  Logs" key="6">{/*短信记录*/}
            <Tab5 record={props.record} ref="Tab5" canEdit={props.canEdit} visible={props.visible} />
          </TabPane>
          <TabPane tab="Loan History" key="7">{/*借款记录*/}
            <Tab6 record={props.record} ref="Tab6" canEdit={props.canEdit} visible={props.visible} />
          </TabPane>
        </Tabs>
        <Form horizontal form={this.props.form}>
          <Input  {...getFieldProps('id', { initialValue: '' })} type="hidden" />
          <Row>
            <Col span="24">
              <FormItem  {...formItemLayout} label="Audit Opinion:">
                {props.title != " Recommended  Decision" ? (
                  <Select  {...getFieldProps('state', { initialValue: "3" })} disabled={!props.canEdit} value={this.state.firstValue} onChange={this.handleChangeOption}>
                    <Option value="3"> Approved</Option>
                    <Option value="32">Rejected</Option>
                  </Select>) : (<Input type="text" disabled={!props.canEdit} {...getFieldProps('stateStr')} />)}
              </FormItem>
            </Col>
          </Row>
          {<Row>
            <Col span="24">
              <FormItem  {...formItemLayout} label="Audit Opinion:">
                {props.title != "Approval Result" ? (
                  this.state.firstValue == "3" ?
                    <Select {...getFieldProps('unstate', { initialValue: "3" })} value="3" disabled={!props.canEdit} >
                      <Option value="3">Approved</Option>
                    </Select> :
                    <Select {...getFieldProps('unstate', { initialValue: "33" })} disabled={!props.canEdit} >
                      <Option value="33">Rejected & Reapply Immediately</Option>
                      <Option value="32">Rejected & Reapply In 15 Days</Option>
                      <Option value="34">Rejected & Blacklist</Option>
                    </Select>
                ) : (<Input type="text" disabled={!props.canEdit} {...getFieldProps('unstateStr')} />)}
              </FormItem>
              {this.state.firstValue == "3"?'':
              <FormItem  {...formItemLayout} label="Remark:">
                <Input disabled={!props.canEdit} type="textarea" placeholder="" rows={4} style={{ width: "500px", height: "40px" }}   {...getFieldProps('remark', { initialValue: '' })} />

              </FormItem>
              }
            </Col>
          </Row>}
        </Form>
      </Modal>
    );
  }
});
Lookdetails = createForm()(Lookdetails);
export default Lookdetails;