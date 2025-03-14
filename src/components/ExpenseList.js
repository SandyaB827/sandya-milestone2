import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ExpenseService } from '../services/ExpenseService';
import './ExpenseList.css';

const ExpenseList = ({ friends, expenses, setExpenses }) => {
  const [editId, setEditId] = useState(null);

  const validationSchema = Yup.object({
    description: Yup.string()
      .trim()
      .required('Please enter a description'),
    amount: Yup.number()
      .required('Please enter an amount')
      .positive('Amount must be positive')
      .typeError('Amount must be a number'),
    payerId: Yup.string()
      .required('Please select a payer'),
    participants: Yup.array()
      .min(1, 'Please select at least one participant')
      .required('Participants are required'),
    date: Yup.date()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
    splitType: Yup.string()
      .oneOf(['equal', 'custom'], 'Invalid split type')
      .required('Please select a split type'),
    customSplits: Yup.object().when('splitType', {
      is: 'custom',
      then: (schema) =>
        schema
          .test('sum-to-100', 'Percentages must sum to 100%', (value, context) => {
            const participants = context.parent.participants;
            const total = participants.reduce((sum, id) => sum + (value[id] || 0), 0);
            return total === 100;
          })
          .test('all-participants', 'All participants must have a percentage', (value, context) => {
            const participants = context.parent.participants;
            return participants.every(id => value[id] !== undefined && value[id] >= 0);
          })
          .required('Custom percentages are required for custom split'),
      otherwise: (schema) => schema.notRequired()
    })
  });

  const initialValues = {
    description: '',
    amount: '',
    payerId: '',
    participants: [],
    date: '',
    splitType: 'equal',
    customSplits: {}
  };

  const editInitialValues = (expense) => ({
    description: expense.description,
    amount: expense.amount,
    payerId: String(expense.payerId),
    participants: expense.participants.map(String),
    date: expense.date.toISOString().split('T')[0],
    splitType: expense.splitType || 'equal',
    customSplits: expense.customSplits || {}
  });

  const addExpense = (values, { resetForm }) => {
    const updatedExpenses = ExpenseService.addExpense(
      values.description.trim(),
      values.amount,
      Number(values.payerId),
      values.participants.map(Number),
      values.date || null,
      values.splitType,
      values.splitType === 'custom' ? values.customSplits : {}
    );
    setExpenses([...updatedExpenses]);
    resetForm();
  };

  const removeExpense = (id) => {
    const updatedExpenses = ExpenseService.removeExpense(id);
    setExpenses([...updatedExpenses]);
  };

  const startEditing = (expense) => {
    setEditId(expense.id);
  };

  const saveEdit = (values) => {
    const updates = {
      description: values.description.trim(),
      amount: parseFloat(values.amount),
      payerId: Number(values.payerId),
      participants: values.participants.map(Number),
      date: values.date || null,
      splitType: values.splitType,
      customSplits: values.splitType === 'custom' ? values.customSplits : {}
    };
    const updatedExpenses = ExpenseService.editExpense(editId, updates);
    setExpenses([...updatedExpenses]);
    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Expenses</h2>

        {/* Add Expense Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={addExpense}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="mb-3">
                <Field
                  type="text"
                  name="description"
                  className="form-control mb-2"
                  placeholder="Description"
                />
                <ErrorMessage name="description" component="div" className="text-danger small mb-2" />
                
                <Field
                  type="number"
                  name="amount"
                  className="form-control mb-2"
                  placeholder="Amount"
                />
                <ErrorMessage name="amount" component="div" className="text-danger small mb-2" />
                
                <Field as="select" name="payerId" className="form-select mb-2">
                  <option value="">Select Payer</option>
                  {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </Field>
                <ErrorMessage name="payerId" component="div" className="text-danger small mb-2" />
                
                <Field
                  as="select"
                  name="participants"
                  multiple
                  className="form-select mb-2"
                  onChange={(e) => setFieldValue('participants', [...e.target.selectedOptions].map(o => o.value))}
                >
                  {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </Field>
                <ErrorMessage name="participants" component="div" className="text-danger small mb-2" />
                
                <Field
                  type="date"
                  name="date"
                  className="form-control mb-2"
                  placeholder="Date (optional)"
                />
                <ErrorMessage name="date" component="div" className="text-danger small mb-2" />
                
                <Field as="select" name="splitType" className="form-select mb-2">
                  <option value="equal">Equal Split</option>
                  <option value="custom">Custom Split</option>
                </Field>
                <ErrorMessage name="splitType" component="div" className="text-danger small mb-2" />
                
                {values.splitType === 'custom' && values.participants.length > 0 && (
                  <div className="mb-2">
                    <h4>Custom Percentages (%)</h4>
                    {values.participants.map(id => (
                      <div key={id} className="input-group mb-2">
                        <span className="input-group-text">
                          {friends.find(f => f.id === Number(id))?.name || 'Unknown'}
                        </span>
                        <Field
                          type="number"
                          name={`customSplits.${id}`}
                          className="form-control"
                          min="0"
                          max="100"
                          placeholder="Percentage"
                        />
                      </div>
                    ))}
                    <ErrorMessage name="customSplits" component="div" className="text-danger small mb-2" />
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-100">Add Expense</button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Expense List */}
        <ul className="list-group">
          {expenses.map(exp => (
            <li key={exp.id} className="list-group-item">
              {editId === exp.id ? (
                <Formik
                  initialValues={editInitialValues(exp)}
                  validationSchema={validationSchema}
                  onSubmit={saveEdit}
                >
                  {({ values, setFieldValue }) => (
                    <Form>
                      <Field
                        type="text"
                        name="description"
                        className="form-control mb-2"
                        placeholder="Description"
                      />
                      <ErrorMessage name="description" component="div" className="text-danger small mb-2" />
                      
                      <Field
                        type="number"
                        name="amount"
                        className="form-control mb-2"
                        placeholder="Amount"
                      />
                      <ErrorMessage name="amount" component="div" className="text-danger small mb-2" />
                      
                      <Field as="select" name="payerId" className="form-select mb-2">
                        <option value="">Select Payer</option>
                        {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </Field>
                      <ErrorMessage name="payerId" component="div" className="text-danger small mb-2" />
                      
                      <Field
                        as="select"
                        name="participants"
                        multiple
                        className="form-select mb-2"
                        onChange={(e) => setFieldValue('participants', [...e.target.selectedOptions].map(o => o.value))}
                      >
                        {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </Field>
                      <ErrorMessage name="participants" component="div" className="text-danger small mb-2" />
                      
                      <Field
                        type="date"
                        name="date"
                        className="form-control mb-2"
                        placeholder="Date (optional)"
                      />
                      <ErrorMessage name="date" component="div" className="text-danger small mb-2" />
                      
                      <Field as="select" name="splitType" className="form-select mb-2">
                        <option value="equal">Equal Split</option>
                        <option value="custom">Custom Split</option>
                      </Field>
                      <ErrorMessage name="splitType" component="div" className="text-danger small mb-2" />
                      
                      {values.splitType === 'custom' && values.participants.length > 0 && (
                        <div className="mb-2">
                          <h4>Custom Percentages (%)</h4>
                          {values.participants.map(id => (
                            <div key={id} className="input-group mb-2">
                              <span className="input-group-text">
                                {friends.find(f => f.id === Number(id))?.name || 'Unknown'}
                              </span>
                              <Field
                                type="number"
                                name={`customSplits.${id}`}
                                className="form-control"
                                min="0"
                                max="100"
                                placeholder="Percentage"
                              />
                            </div>
                          ))}
                          <ErrorMessage name="customSplits" component="div" className="text-danger small mb-2" />
                        </div>
                      )}
                      <button type="submit" className="btn btn-success me-2">Save</button>
                      <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </Form>
                  )}
                </Formik>
              ) : (
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <span>
                    {exp.description} - ₹{exp.amount} (Paid by: {friends.find(f => f.id === exp.payerId)?.name || 'Unknown'}, 
                    Participants: {exp.participants.map(id => friends.find(f => f.id === id)?.name || 'Unknown').join(', ')}, 
                    Date: {new Date(exp.date).toLocaleDateString()},
                    Split: {exp.splitType === 'custom' 
                      ? `Custom (${Object.entries(exp.customSplits)
                          .map(([id, pct]) => `${friends.find(f => f.id === Number(id))?.name || 'Unknown'}: ${pct}%`)
                          .join(', ')})`
                      : 'Equal'})
                  </span>
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => startEditing(exp)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeExpense(exp.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseList;