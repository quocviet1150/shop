using System.ComponentModel.DataAnnotations;
using BackEnd.Models;

namespace BackEnd.Dtos.UserDtos;

public class RegisterRequest
{
    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
    
    [Required]
    [Compare("Password")]
    public string ConfirmPassword { get; set; }
    
    [Range(typeof(bool), "true", "true")]
    public bool AcceptTerms { get; set; }
}