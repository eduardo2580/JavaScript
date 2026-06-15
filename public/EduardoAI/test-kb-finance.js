#!/usr/bin/env node
/* Quick test to verify kb-finance.js loads correctly */

var window = { EduardoKB: [] };

// Load kb-finance.js
var fs = require('fs');
var code = fs.readFileSync('./js/kb-finance.js', 'utf8');
eval(code);

// Test KB registration
if (window.EduardoKB && window.EduardoKB.length > 0) {
  var kb = window.EduardoKB[window.EduardoKB.length - 1];
  console.log('\n✓ KB Finance loaded successfully!');
  console.log('────────────────────────────────');
  console.log('ID: ' + kb.id);
  console.log('Priority: ' + kb.priority);
  console.log('Languages: ' + Object.keys(kb.lang).join(', '));
  console.log('Portuguese entries: ' + Object.keys(kb.lang.pt).length);
  console.log('English entries: ' + Object.keys(kb.lang.en).length);
  console.log('Spanish entries: ' + Object.keys(kb.lang.es).length);
  
  // Test getAnswer method
  if (kb.getAnswer) {
    console.log('\n✓ getAnswer function available');
    var testKey = kb.getAnswer('juros_e_tempo', 'pt');
    console.log('Test lookup (juros_e_tempo): ' + (testKey ? 'OK' : 'FAIL'));
  }
  
  // Test calculate method
  if (kb.calculate) {
    console.log('✓ calculate function available');
    var compoundTest = kb.calculate('compound_interest', {
      principal: 1000, rate: 0.05, time: 10, compounds: 1
    });
    console.log('Test calculation (compound interest): ' + (compoundTest ? compoundTest.toFixed(2) : 'FAIL'));
  }
  
  console.log('────────────────────────────────\n');
} else {
  console.error('✗ KB Finance failed to load!');
  process.exit(1);
}
