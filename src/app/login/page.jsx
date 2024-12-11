// pages/login.js
"use client";
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';
import LoginForm from '@/components/loginForm';

const LoginPage = () => {


  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
