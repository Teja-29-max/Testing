#!/usr/bin/env python3
"""
Software Testing Internship Form Script
Processes name and email input from command line arguments
"""

import sys
import argparse


def main():
    """Main function to process command line arguments and display formatted output."""
    parser = argparse.ArgumentParser(
        description='Process internship application data',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python form_script.py --name "John Doe" --email "john@example.com"
  python form_script.py -n "Jane Smith" -e "jane@company.org"
        '''
    )
    
    parser.add_argument(
        '--name', '-n',
        required=True,
        help='Full name of the applicant'
    )
    
    parser.add_argument(
        '--email', '-e',
        required=True,
        help='Email address of the applicant'
    )
    
    try:
        args = parser.parse_args()
        
        # Basic validation
        if not args.name.strip():
            print("Error: Name cannot be empty")
            sys.exit(1)
            
        if not args.email.strip():
            print("Error: Email cannot be empty")
            sys.exit(1)
            
        if '@' not in args.email:
            print("Error: Email must contain '@' symbol")
            sys.exit(1)
        
        # Display formatted output
        print("Received data:")
        print(f"Name: {args.name}")
        print(f"Email: {args.email}")
        
    except KeyboardInterrupt:
        print("\nOperation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()